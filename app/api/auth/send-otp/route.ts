import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/send-otp
 * Body: { phone: string }   (10-digit Indian mobile)
 *
 * Integrations (uncomment one):
 *  - Msg91:   https://msg91.com/help/api/otp/send
 *  - Twilio:  https://www.twilio.com/docs/verify/api
 *  - Fast2SMS: https://www.fast2sms.com/docs/api
 */

// Rate limiting: simple in-memory map (use Redis in production)
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_PER_HOUR = 5

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json()
    const phone = String(body.phone ?? '').replace(/\D/g, '')

    // Validate
    if (!phone || phone.length !== 10 || !/^[6-9]/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })
    }

    // Rate limit
    const now = Date.now()
    const rec = attempts.get(phone)
    if (rec && rec.resetAt > now && rec.count >= MAX_PER_HOUR) {
      const waitMin = Math.ceil((rec.resetAt - now) / 60_000)
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${waitMin} min.` },
        { status: 429 }
      )
    }
    attempts.set(phone, {
      count:   (rec && rec.resetAt > now ? rec.count : 0) + 1,
      resetAt: (rec && rec.resetAt > now) ? rec.resetAt : now + 3_600_000,
    })

    // ── Msg91 integration (uncomment + add env vars) ──────────────
    // const msg91Res = await fetch('https://api.msg91.com/api/v5/otp', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'authkey': process.env.MSG91_AUTH_KEY!,
    //   },
    //   body: JSON.stringify({
    //     template_id: process.env.MSG91_OTP_TEMPLATE_ID,
    //     mobile: `91${phone}`,
    //     otp_length: 6,
    //     otp_expiry: 10,
    //   }),
    // })
    // if (!msg91Res.ok) throw new Error('OTP provider error')
    // ─────────────────────────────────────────────────────────────

    // ── Twilio Verify (uncomment + add env vars) ──────────────────
    // const twilio = require('twilio')(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // )
    // await twilio.verify.v2
    //   .services(process.env.TWILIO_VERIFY_SID)
    //   .verifications.create({ to: `+91${phone}`, channel: 'sms' })
    // ─────────────────────────────────────────────────────────────

    // Development: log OTP to console (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] OTP for ${phone}: 123456`)
    }

    return NextResponse.json({ success: true, message: 'OTP sent.' })
  } catch (err: any) {
    console.error('send-otp error:', err)
    return NextResponse.json({ error: 'Failed to send OTP.' }, { status: 500 })
  }
}
