import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

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

    return NextResponse.json({
      profile: {
        name:            user.name            ?? '',
        phone:           user.phone,
        email:           user.email           ?? '',
        icaiNumber:      user.caProfile.icaiNumber,
        icaiVerified:    user.caProfile.icaiVerified,
        available:       user.caProfile.available,
        rating:          Number(user.caProfile.rating).toFixed(1),
        totalReviews:    user.caProfile.totalReviews,
        specializations: user.caProfile.specializations,
        upiId:           user.caProfile.upiId    ?? '',
        bankIfsc:        user.caProfile.bankIfsc  ?? '',
      },
    })
  } catch (err) {
    console.error('[GET /api/ca/profile]', err)
    return NextResponse.json({ error: 'Failed to load profile.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session || session.role !== 'ca') {
      return NextResponse.json({ error: 'Not authenticated as CA.' }, { status: 401 })
    }

    const { name, email, available, specializations, upiId, bankIfsc } = await req.json()

    const user = await prisma.user.findUnique({
      where:   { phone: session.phone },
      include: { caProfile: true },
    })
    if (!user?.caProfile) {
      return NextResponse.json({ error: 'CA profile not found.' }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data:  {
          ...(name  !== undefined ? { name:  name  || null } : {}),
          ...(email !== undefined ? { email: email || null } : {}),
        },
      }),
      prisma.cAProfile.update({
        where: { id: user.caProfile.id },
        data:  {
          ...(available       !== undefined ? { available }       : {}),
          ...(specializations !== undefined ? { specializations } : {}),
          ...(upiId           !== undefined ? { upiId:    upiId    || null } : {}),
          ...(bankIfsc        !== undefined ? { bankIfsc: bankIfsc || null } : {}),
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/ca/profile]', err)
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }
}
