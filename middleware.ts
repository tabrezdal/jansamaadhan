import { NextRequest, NextResponse } from 'next/server'

/**
 * Next.js middleware — runs on every matched route before rendering.
 *
 * Protected routes (require session cookie):
 *   /dashboard, /order/*, /profile, /documents, /onboarding, /ca-portal
 *
 * Auth routes (redirect to dashboard if already logged in):
 *   /login, /register
 */

const PROTECTED = ['/dashboard', '/order', '/profile', '/documents', '/onboarding', '/ca-portal']
const AUTH_ONLY  = ['/login', '/register']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session      = req.cookies.get('js_session')?.value

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  const isAuthOnly  = AUTH_ONLY.some(p => pathname.startsWith(p))

  // Unauthenticated → redirect to /login
  if (isProtected && !session) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Already logged in → redirect to /dashboard
  if (isAuthOnly && session) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/order/:path*',
    '/profile/:path*',
    '/documents/:path*',
    '/onboarding/:path*',
    '/ca-portal/:path*',
    '/login',
    '/register',
  ],
}
