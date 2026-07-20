import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// GET /api/orders/[id] — get single order for current user
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { phone: session.phone } })
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

    const order = await prisma.order.findFirst({
      where:   { id: params.id, customerId: user.id },
      include: {
        serviceSnapshot: true,
        payment:         true,
        documents:       true,
        events:          { orderBy: { createdAt: 'desc' }, take: 5 },
        ca:              { include: { user: { select: { name: true } } } },
      },
    })

    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 })

    return NextResponse.json({ order })
  } catch (err) {
    console.error('[GET /api/orders/[id]]', err)
    return NextResponse.json({ error: 'Failed to load order.' }, { status: 500 })
  }
}
