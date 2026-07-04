import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// GET /api/ca/cases — list all cases for this CA
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

    const cases = await prisma.order.findMany({
      where:   { caId: user.caProfile.id },
      include: {
        serviceSnapshot: true,
        payment:         true,
        documents:       true,
        events:          { orderBy: { createdAt: 'desc' }, take: 5 },
        customer:        { select: { id: true, name: true, phone: true, state: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ cases })
  } catch (err) {
    console.error('[GET /api/ca/cases]', err)
    return NextResponse.json({ error: 'Failed to load cases.' }, { status: 500 })
  }
}
