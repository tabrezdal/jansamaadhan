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

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (status && status !== 'ALL') where.status = status

    const payments = await prisma.payment.findMany({
      where,
      include: {
        order: {
          include: {
            customer:        { select: { name: true, phone: true } },
            serviceSnapshot: { select: { name: true, price: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take:    50,
    })

    const totals = await prisma.payment.groupBy({
      by:     ['status'],
      _sum:   { amountInPaise: true },
      _count: { id: true },
    })

    return NextResponse.json({ payments, totals })
  } catch (err) {
    console.error('[admin/payments GET]', err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}
