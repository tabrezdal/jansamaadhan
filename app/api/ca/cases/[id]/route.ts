import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// GET /api/ca/cases/[id] — single case detail for CA
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
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

    // Allow CA to view their own cases OR any unassigned NEW case
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        OR: [
          { caId: user.caProfile.id },
          { caId: null, status: 'NEW' },
        ],
      },
      include: {
        serviceSnapshot: true,
        payment:         true,
        documents:       { orderBy: { createdAt: 'asc' } },
        events:          { orderBy: { createdAt: 'desc' } },
        customer:        {
          select: { id: true, name: true, phone: true, state: true, email: true },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Case not found.' }, { status: 404 })
    }

    return NextResponse.json({ case: order })
  } catch (err) {
    console.error('[GET /api/ca/cases/[id]]', err)
    return NextResponse.json({ error: 'Failed to load case.' }, { status: 500 })
  }
}
