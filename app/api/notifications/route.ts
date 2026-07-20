import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// GET /api/notifications
// Returns recent OrderEvents for the current user's orders,
// formatted as notifications with type, title, message, timestamp.

export async function GET() {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { phone: session.phone } })
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

    const events = await prisma.orderEvent.findMany({
      where: { order: { customerId: user.id } },
      include: {
        order: {
          select: {
            id:          true,
            orderNumber: true,
            status:      true,
            serviceSnapshot: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take:    30,
    })

    const notifications = events.map(e => {
      // Determine notification type from actor + message content
      let type: 'payment' | 'status' | 'docs' | 'ca' | 'info' = 'info'
      if (e.message.toLowerCase().includes('payment')) type = 'payment'
      else if (e.message.toLowerCase().includes('doc')) type = 'docs'
      else if (e.message.toLowerCase().includes('ca') || e.message.toLowerCase().includes('assigned')) type = 'ca'
      else if (['IN_PROGRESS','COMPLETED','DOCS_REQUESTED','READY_TO_FILE'].some(s => e.message.includes(s))) type = 'status'

      return {
        id:          e.id,
        type,
        actor:       e.actor,
        message:     e.message,
        createdAt:   e.createdAt,
        orderId:     e.order.id,
        orderNumber: e.order.orderNumber,
        serviceName: e.order.serviceSnapshot.name,
        orderStatus: e.order.status,
      }
    })

    return NextResponse.json({ notifications })
  } catch (err) {
    console.error('[GET /api/notifications]', err)
    return NextResponse.json({ error: 'Failed to load notifications.' }, { status: 500 })
  }
}
