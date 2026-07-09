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
    const search = searchParams.get('search')
    const role   = searchParams.get('role')

    const where: Record<string, unknown> = {}
    if (role && role !== 'ALL') where.role = role
    if (search) {
      where.OR = [
        { name:  { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        _count:    { select: { orders: true } },
        caProfile: { select: { icaiNumber: true, icaiVerified: true, rating: true } },
      },
      orderBy: { createdAt: 'desc' },
      take:    50,
    })

    return NextResponse.json({ users })
  } catch (err) {
    console.error('[admin/users GET]', err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!await checkAdmin(session.phone)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { userId, role } = await req.json()
    await prisma.user.update({ where: { id: userId }, data: { role } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/users PATCH]', err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}
