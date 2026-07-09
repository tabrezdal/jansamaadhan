import { NextRequest, NextResponse } from 'next/server'
import { decodeSession, COOKIE_NAME } from '@/lib/session'

const CUSTOMER_PROTECTED = ['/dashboard', '/order', '/profile', '/documents', '/onboarding']
const CA_PROTECTED        = ['/ca-portal']
const ADMIN_PROTECTED     = ['/admin']
const AUTH_ONLY           = ['/login', '/register', '/ca-register']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session       = decodeSession(req.cookies.get(COOKIE_NAME)?.value)

  const isCustomerArea = CUSTOMER_PROTECTED.some(p => pathname.startsWith(p))
  const isCAArea        = CA_PROTECTED.some(p => pathname.startsWith(p))
  const isAdminArea     = ADMIN_PROTECTED.some(p => pathname.startsWith(p))
  const isAuthOnly      = AUTH_ONLY.some(p => pathname.startsWith(p))
  const isProtected     = isCustomerArea || isCAArea || isAdminArea

  // Unauthenticated → redirect to login
  if (isProtected && !session) {
    const url = req.nextUrl.clone()
    url.pathname = isCAArea ? '/ca-register' : '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Admin area — only ADMIN role allowed (checked in page via requireAdmin())
  // Middleware just ensures they're logged in; role check is in requireAdmin()
  if (isAdminArea && !session) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Wrong role for CA area
  if (session && isCAArea && session.role !== 'ca') {
    const url = req.nextUrl.clone()
    url.pathname = '/restricted'
    url.searchParams.set('for', 'ca')
    return NextResponse.redirect(url)
  }

  // Wrong role for customer area
  if (session && isCustomerArea && session.role !== 'customer') {
    const url = req.nextUrl.clone()
    url.pathname = '/restricted'
    url.searchParams.set('for', 'customer')
    return NextResponse.redirect(url)
  }

  // Already logged in → redirect away from auth pages
  if (isAuthOnly && session) {
    const url = req.nextUrl.clone()
    url.pathname = session.role === 'ca' ? '/ca-portal' : '/dashboard'
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
    '/admin/:path*',
    '/login',
    '/register',
    '/ca-register',
  ],
}
