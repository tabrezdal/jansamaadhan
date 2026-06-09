import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/verify-otp
 * Body: { phone: string, code: string }
 *
 * On success: sets an httpOnly session cookie and returns { success, isNewUser }
 *
 * Production checklist:
 *  1. Replace mock verify with real provider (Msg91 / Twilio Verify)
 *  2. Generate a signed JWT or use NextAuth / Iron Session
 *  3. Store user in DB (PostgreSQL via Prisma / Drizzle)
 *  4. Return isNewUser flag so frontend can redirect to /onboarding vs /dashboard
 */

// Mock OTP store — replace with Redis or your DB in production
const MOCK_OTP = '123456'

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json()
    const phone = String(body.phone ?? '').replace(/\D/g, '')
    const code  = String(body.code  ?? '').replace(/\D/g, '')

    // Basic validation
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })
    }
    if (!code || code.length !== 6) {
      return NextResponse.json({ error: 'Enter a valid 6-digit OTP.' }, { status: 400 })
    }

    // ── Msg91 verify (uncomment) ──────────────────────────────────
    // const res = await fetch(
    //   `https://api.msg91.com/api/v5/otp/verify?mobile=91${phone}&otp=${code}`,
    //   { headers: { authkey: process.env.MSG91_AUTH_KEY! } }
    // )
    // const data = await res.json()
    // if (data.type !== 'success') throw new Error('Invalid OTP')
    // ─────────────────────────────────────────────────────────────

    // ── Twilio verify (uncomment) ─────────────────────────────────
    // const twilio = require('twilio')(...)
    // const check = await twilio.verify.v2
    //   .services(process.env.TWILIO_VERIFY_SID)
    //   .verificationChecks.create({ to: `+91${phone}`, code })
    // if (check.status !== 'approved') throw new Error('Invalid OTP')
    // ─────────────────────────────────────────────────────────────

    // Mock: accept 123456 for any number in dev
    if (process.env.NODE_ENV !== 'development' || code !== MOCK_OTP) {
      // In prod, this line would never be reached (replaced by real verify above)
      if (code !== MOCK_OTP) {
        return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 401 })
      }
    }

    // ── Create / fetch user in DB ─────────────────────────────────
    // const user = await db.user.upsert({
    //   where:  { phone },
    //   create: { phone, createdAt: new Date() },
    //   update: { lastLoginAt: new Date() },
    // })
    // const isNewUser = user.createdAt.getTime() === user.updatedAt.getTime()
    // ─────────────────────────────────────────────────────────────

    const isNewUser = true // mock — replace with DB check

    // ── Issue session token ───────────────────────────────────────
    // Option A: Iron Session (recommended for Next.js)
    //   https://github.com/vvo/iron-session
    // Option B: NextAuth with Credentials provider
    // Option C: Custom JWT stored in httpOnly cookie
    //
    // const token = signJWT({ phone, userId: user.id })
    // ─────────────────────────────────────────────────────────────

    // Set a simple demo cookie (replace with signed JWT in prod)
    const res = NextResponse.json({ success: true, isNewUser })
    res.cookies.set('js_session', `demo_${phone}`, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 30, // 30 days
      path:     '/',
    })
    return res

  } catch (err: any) {
    console.error('verify-otp error:', err)
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 })
  }
}
