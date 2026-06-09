import { NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * Clears session cookie and redirects to /login
 */
export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('js_session', '', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   0,
    path:     '/',
  })
  return res
}
