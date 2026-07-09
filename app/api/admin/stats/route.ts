import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { phone: session.phone } })
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const [
      totalOrders, newOrders, activeOrders, completedOrders,
      totalUsers, totalCAs, verifiedCAs,
      totalRevenue, pendingPayments,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'NEW' } }),
      prisma.order.count({ where: { status: { in: ['IN_PROGRESS', 'DOCS_REQUESTED', 'READY_TO_FILE'] } } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'CA' } }),
      prisma.cAProfile.count({ where: { icaiVerified: true } }),
      prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amountInPaise: true } }),
      prisma.payment.count({ where: { status: 'CREATED' } }),
      prisma.order.findMany({
        take:    10,
        orderBy: { createdAt: 'desc' },
        include: {
          serviceSnapshot: { select: { name: true, price: true } },
          customer:        { select: { name: true, phone: true } },
          ca:              { include: { user: { select: { name: true } } } },
          payment:         { select: { status: true, amountInPaise: true } },
        },
      }),
    ])

    return NextResponse.json({
      stats: {
        totalOrders, newOrders, activeOrders, completedOrders,
        totalUsers, totalCAs, verifiedCAs,
        totalRevenue:    Math.round((totalRevenue._sum.amountInPaise ?? 0) / 100),
        pendingPayments,
      },
      recentOrders,
    })
  } catch (err) {
    console.error('[admin/stats]', err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}
