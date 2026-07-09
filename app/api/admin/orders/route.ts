import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

async function checkAdmin(phone: string) {
  const user = await prisma.user.findUnique({ where: { phone } })
  return user?.role === 'ADMIN' ? user : null
}

// GET /api/admin/orders — list all orders with filters
export async function GET(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!await checkAdmin(session.phone)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const status  = searchParams.get('status')
    const search  = searchParams.get('search')
    const page    = parseInt(searchParams.get('page') ?? '1', 10)
    const perPage = 20

    const where: Record<string, unknown> = {}
    if (status && status !== 'ALL') where.status = status
    if (search) {
      where.OR = [
        { orderNumber:  { contains: search, mode: 'insensitive' } },
        { customer:     { name:  { contains: search, mode: 'insensitive' } } },
        { customer:     { phone: { contains: search } } },
        { serviceSnapshot: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          serviceSnapshot: true,
          customer:        { select: { id: true, name: true, phone: true, state: true } },
          ca:              { include: { user: { select: { name: true, phone: true } } } },
          payment:         { select: { status: true, amountInPaise: true, paidAt: true } },
          _count:          { select: { documents: true, events: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip:    (page - 1) * perPage,
        take:    perPage,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({ orders, total, page, perPage })
  } catch (err) {
    console.error('[admin/orders GET]', err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}

// PATCH /api/admin/orders — assign CA, change status, set priority
export async function PATCH(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const admin = await checkAdmin(session.phone)
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { orderId, action, payload } = await req.json()

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 })

    switch (action) {
      case 'assign_ca': {
        const caProfile = await prisma.cAProfile.findUnique({ where: { id: payload.caProfileId } })
        if (!caProfile) return NextResponse.json({ error: 'CA not found.' }, { status: 404 })
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data:  { caId: caProfile.id, status: order.status === 'NEW' ? 'IN_PROGRESS' : order.status },
          }),
          prisma.orderEvent.create({
            data: { orderId, actor: 'ADMIN', message: `CA assigned by admin: ${admin.name ?? admin.phone}. CA: ${caProfile.id}` },
          }),
        ])
        break
      }
      case 'unassign_ca': {
        await prisma.$transaction([
          prisma.order.update({ where: { id: orderId }, data: { caId: null, status: 'NEW' } }),
          prisma.orderEvent.create({ data: { orderId, actor: 'ADMIN', message: 'CA unassigned by admin. Order returned to queue.' } }),
        ])
        break
      }
      case 'set_status': {
        await prisma.$transaction([
          prisma.order.update({ where: { id: orderId }, data: { status: payload.status } }),
          prisma.orderEvent.create({ data: { orderId, actor: 'ADMIN', message: `Status set to ${payload.status} by admin.` } }),
        ])
        break
      }
      case 'set_priority': {
        await prisma.order.update({ where: { id: orderId }, data: { priority: payload.priority } })
        break
      }
      default:
        return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/orders PATCH]', err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}
