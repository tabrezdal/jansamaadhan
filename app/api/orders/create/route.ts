import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { getServiceBySlug } from '@/lib/allServices'

// POST /api/orders/create
// Body: {
//   serviceSlug, planId, planName, price, slaLabel, caRequired,
//   customerNotes, name, email,
//   uploadedDocKeys: Record<string, string>  // docId → Supabase objectKey
// }

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     ?? '',
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? '',
})

function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(10000 + Math.random() * 90000)
  return `ORD-${year}-${rand}`
}

function parseSla(sla: string): number {
  const s = sla.toLowerCase()
  if (s.includes('same day')) return 8  * 3600000
  if (s.includes('1 hr'))     return 1  * 3600000
  if (s.includes('2 hr'))     return 2  * 3600000
  if (s.includes('6 hr'))     return 6  * 3600000
  if (s.includes('24 hr'))    return 24 * 3600000
  if (s.includes('48 hr'))    return 48 * 3600000
  const days = parseInt(s.match(/(\d+)\s*day/)?.[1] ?? '3', 10)
  return days * 24 * 3600000
}

export async function POST(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session || session.role !== 'customer') {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const body = await req.json()
    const {
      serviceSlug, planId, planName, price,
      slaLabel, caRequired, customerNotes,
      name, email,
      uploadedDocKeys = {} as Record<string, string>,
    } = body

    const catalogService = getServiceBySlug(serviceSlug)
    if (!catalogService) {
      return NextResponse.json({ error: 'Unknown service.' }, { status: 400 })
    }

    const priceInt = parseInt(price, 10)
    if (!priceInt || priceInt < 1) {
      return NextResponse.json({ error: 'Invalid price.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { phone: session.phone } })
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

    // Update profile fields if provided
    if (name || email) {
      await prisma.user.update({
        where: { id: user.id },
        data:  { ...(name ? { name } : {}), ...(email ? { email } : {}) },
      })
    }

    // Create ServiceSnapshot
    const snapshot = await prisma.serviceSnapshot.create({
      data: {
        slug:       serviceSlug,
        planId:     planId     ?? 'default',
        name:       catalogService.name,
        planName:   planName   ?? catalogService.name,
        price:      priceInt,
        slaLabel:   slaLabel   ?? catalogService.sla,
        caRequired: caRequired ?? catalogService.caRequired,
      },
    })

    // Create Order
    const order = await prisma.order.create({
      data: {
        orderNumber:       generateOrderNumber(),
        customerId:        user.id,
        serviceSnapshotId: snapshot.id,
        customerNotes:     customerNotes || null,
        status:            'PENDING_PAYMENT',
        dueBy:             new Date(Date.now() + parseSla(slaLabel ?? catalogService.sla)),
      },
    })

    // Link any already-uploaded documents to this order
    const docEntries = Object.entries(uploadedDocKeys as Record<string, string>)
    if (docEntries.length > 0) {
      const docsNeeded = catalogService.docsNeeded ?? []
      await Promise.all(
        docEntries.map(([docId, objectKey]) => {
          const docDef = docsNeeded.find(d => d.id === docId)
          return prisma.orderDocument.create({
            data: {
              orderId:      order.id,
              docKey:       docId,
              label:        docDef?.label ?? docId,
              required:     docDef?.required ?? true,
              status:       'UPLOADED',
              r2ObjectKey:  objectKey,
              uploadedById: user.id,
              uploadedAt:   new Date(),
            },
          })
        })
      )
    }

    // Create Razorpay order
    const amountInPaise = priceInt * 100
    const rzpOrder = await razorpay.orders.create({
      amount:   amountInPaise,
      currency: 'INR',
      receipt:  order.id,
      notes:    { orderNumber: order.orderNumber, serviceSlug },
    })

    // Persist Payment row
    await prisma.payment.create({
      data: {
        orderId:         order.id,
        razorpayOrderId: rzpOrder.id,
        amountInPaise,
        status:          'CREATED',
      },
    })

    // Audit event
    await prisma.orderEvent.create({
      data: {
        orderId: order.id,
        actor:   'SYSTEM',
        message: `Order created — ${catalogService.name}. ${docEntries.length} document(s) uploaded. Awaiting payment.`,
      },
    })

    return NextResponse.json({
      orderId:         order.id,
      orderNumber:     order.orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount:          amountInPaise,
      currency:        'INR',
      keyId:           process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[orders/create]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create order.' },
      { status: 500 },
    )
  }
}
