import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// GET /api/ca/stats — overview numbers for CA dashboard
export async function GET() {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session || session.role !== 'ca') {
      return NextResponse.json({ error: 'Not authenticated as CA.' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where:   { phone: session.phone },
      include: { caProfile: true },
    })
    if (!user?.caProfile) {
      return NextResponse.json({ error: 'CA profile not found.' }, { status: 404 })
    }

    const caId = user.caProfile.id

    const [active, completed, docsNeeded, newAvailable] = await Promise.all([
      prisma.order.count({ where: { caId, status: { in: ['IN_PROGRESS','DOCS_REQUESTED','READY_TO_FILE'] } } }),
      prisma.order.count({ where: { caId, status: 'COMPLETED' } }),
      prisma.order.count({ where: { caId, status: 'DOCS_REQUESTED' } }),
      prisma.order.count({ where: { caId: null, status: 'NEW' } }),
    ])

    // Earnings: sum of completed order prices (CA gets 70% — show gross for now)
    const completedOrders = await prisma.order.findMany({
      where:   { caId, status: 'COMPLETED' },
      include: { serviceSnapshot: { select: { price: true } } },
    })
    const grossEarnings = completedOrders.reduce((sum, o) => sum + o.serviceSnapshot.price, 0)
    const caEarnings    = Math.round(grossEarnings * 0.7)

    return NextResponse.json({
      stats: {
        active,
        completed,
        docsNeeded,
        newAvailable,
        grossEarnings,
        caEarnings,
        rating:       Number(user.caProfile.rating).toFixed(1),
        totalReviews: user.caProfile.totalReviews,
      },
    })
  } catch (err) {
    console.error('[GET /api/ca/stats]', err)
    return NextResponse.json({ error: 'Failed to load stats.' }, { status: 500 })
  }
}
