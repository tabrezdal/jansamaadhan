import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// GET /api/profile — return current user's profile fields
export async function GET() {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { phone: session.phone } })
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

    return NextResponse.json({
      profile: {
        name:       user.name       ?? '',
        phone:      user.phone,
        email:      user.email      ?? '',
        city:       user.city       ?? '',
        state:      user.state      ?? '',
        profession: user.profession ?? '',
      },
    })
  } catch (err) {
    console.error('[GET /api/profile]', err)
    return NextResponse.json({ error: 'Failed to load profile.' }, { status: 500 })
  }
}

// PATCH /api/profile — update editable profile fields
export async function PATCH(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

    const { name, email, city, state, profession } = await req.json()

    const user = await prisma.user.update({
      where: { phone: session.phone },
      data: {
        ...(name       !== undefined ? { name:       name       || null } : {}),
        ...(email      !== undefined ? { email:      email      || null } : {}),
        ...(city       !== undefined ? { city:       city       || null } : {}),
        ...(state      !== undefined ? { state:      state      || null } : {}),
        ...(profession !== undefined ? { profession: profession || null } : {}),
      },
    })

    return NextResponse.json({ success: true, profile: { name: user.name, email: user.email, city: user.city, state: user.state, profession: user.profession } })
  } catch (err) {
    console.error('[PATCH /api/profile]', err)
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }
}
