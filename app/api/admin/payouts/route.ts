import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

async function checkAdmin(phone: string) {
  const user = await prisma.user.findUnique({ where: { phone } })
  return user?.role === 'ADMIN' ? user : null
}

export async function GET(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!await checkAdmin(session.phone)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const payouts = await prisma.payout.findMany({
      include: {
        ca: { include: { user: { select: { name: true, phone: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ payouts })
  } catch (err) {
    console.error('[admin/payouts GET]', err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}

// POST — create payout entries for all CAs for a given period
export async function POST(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!await checkAdmin(session.phone)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { periodLabel } = await req.json()
    if (!periodLabel) return NextResponse.json({ error: 'periodLabel required.' }, { status: 400 })

    // Find all CAs with completed orders not yet in a payout for this period
    const cas = await prisma.cAProfile.findMany({
      include: {
        assignedOrders: {
          where:   { status: 'COMPLETED' },
          include: { serviceSnapshot: { select: { price: true } } },
        },
      },
    })

    const created = []
    for (const ca of cas) {
      if (ca.assignedOrders.length === 0) continue
      const gross  = ca.assignedOrders.reduce((s, o) => s + o.serviceSnapshot.price, 0)
      const amount = Math.round(gross * 0.7)

      const existing = await prisma.payout.findFirst({
        where: { caId: ca.id, periodLabel },
      })
      if (existing) continue

      const payout = await prisma.payout.create({
        data: {
          caId:       ca.id,
          periodLabel,
          amount,
          caseCount:  ca.assignedOrders.length,
          status:     'UPCOMING',
        },
      })
      created.push(payout)
    }

    return NextResponse.json({ success: true, created: created.length })
  } catch (err) {
    console.error('[admin/payouts POST]', err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}

// PATCH — update payout status
export async function PATCH(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!await checkAdmin(session.phone)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { payoutId, status } = await req.json()
    await prisma.payout.update({
      where: { id: payoutId },
      data:  { status, ...(status === 'PAID' ? { paidAt: new Date() } : {}) },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/payouts PATCH]', err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}
