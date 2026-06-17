'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ShieldAlert, ArrowRight, LogOut } from 'lucide-react'

function RestrictedInner() {
  const params = useSearchParams()
  const forArea = params.get('for') === 'ca' ? 'ca' : 'customer'

  const copy = forArea === 'ca'
    ? {
        heading:  'This area is for verified CAs',
        body:     'The CA Portal is reserved for chartered accountants who have registered and verified their ICAI membership with JanSamaadhan. Your account is signed in as a customer.',
        ctaLabel: 'Go to my dashboard',
        ctaHref:  '/dashboard',
        altLabel: 'Are you a CA?',
        altLink:  'Sign up as a CA professional',
        altHref:  '/ca-register',
      }
    : {
        heading:  'This area is for customers',
        body:     'Your account is registered as a CA professional. The customer dashboard and order flows are reserved for citizen accounts. Use the CA Portal to manage your cases.',
        ctaLabel: 'Go to CA Portal',
        ctaHref:  '/ca-portal',
        altLabel: 'Need a customer account?',
        altLink:  'Register as a customer',
        altHref:  '/register',
      }

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={28} className="text-brand-amber" strokeWidth={1.5} />
        </div>

        <h1 className="font-display text-2xl font-bold text-brand-ink mb-3">
          {copy.heading}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          {copy.body}
        </p>

        <Link
          href={copy.ctaHref}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-teal text-white font-semibold text-sm hover:bg-brand-teal2 transition-all shadow-md shadow-brand-teal/20 hover:-translate-y-0.5 mb-4"
        >
          {copy.ctaLabel}
          <ArrowRight size={16} />
        </Link>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-sm text-gray-500 mb-2">{copy.altLabel}</p>
        <Link href={copy.altHref} className="text-sm font-semibold text-brand-teal hover:underline">
          {copy.altLink}
        </Link>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <button
            onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/' }}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={12} />
            Sign out and use a different account
          </button>
        </div>
      </div>
    </div>
  )
}

function RestrictedSkeleton() {
  return <div className="min-h-screen bg-[#FAFBFC]" />
}

export default function RestrictedPage() {
  return (
    <Suspense fallback={<RestrictedSkeleton />}>
      <RestrictedInner />
    </Suspense>
  )
}