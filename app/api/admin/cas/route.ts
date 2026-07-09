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
    const verified = searchParams.get('verified')
    const search   = searchParams.get('search')

    const where: Record<string, unknown> = {}
    if (verified === 'true')  where.icaiVerified = true
    if (verified === 'false') where.icaiVerified = false
    if (search) {
      where.OR = [
        { icaiNumber: { contains: search, mode: 'insensitive' } },
        { user: { name:  { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search } } },
      ]
    }

    const cas = await prisma.cAProfile.findMany({
      where,
      include: {
        user:   { select: { id: true, name: true, phone: true, email: true, createdAt: true } },
        _count: { select: { assignedOrders: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ cas })
  } catch (err) {
    console.error('[admin/cas GET]', err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!await checkAdmin(session.phone)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { caProfileId, action } = await req.json()

    switch (action) {
      case 'verify':
        await prisma.cAProfile.update({ where: { id: caProfileId }, data: { icaiVerified: true } })
        break
      case 'unverify':
        await prisma.cAProfile.update({ where: { id: caProfileId }, data: { icaiVerified: false } })
        break
      case 'toggle_available':
        const ca = await prisma.cAProfile.findUnique({ where: { id: caProfileId } })
        if (!ca) return NextResponse.json({ error: 'CA not found.' }, { status: 404 })
        await prisma.cAProfile.update({ where: { id: caProfileId }, data: { available: !ca.available } })
        break
      default:
        return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/cas PATCH]', err)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}
