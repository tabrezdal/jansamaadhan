import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// GET /api/ca/available — unassigned NEW orders any verified CA can accept
export async function GET() {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session || session.role !== 'ca') {
      return NextResponse.json({ error: 'Not authenticated as CA.' }, { status: 401 })
    }

    const cases = await prisma.order.findMany({
      where: { caId: null, status: 'NEW' },
      include: {
        serviceSnapshot: true,
        payment:         true,
        documents:       true,
        events:          { orderBy: { createdAt: 'desc' }, take: 3 },
        customer:        { select: { id: true, name: true, phone: true, state: true } },
      },
      orderBy: { createdAt: 'asc' },
      take:    30,
    })

    return NextResponse.json({ cases })
  } catch (err) {
    console.error('[GET /api/ca/available]', err)
    return NextResponse.json({ error: 'Failed to load available cases.' }, { status: 500 })
  }
}
