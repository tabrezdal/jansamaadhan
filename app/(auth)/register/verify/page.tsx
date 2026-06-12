'use client'

import { Suspense } from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react'

const OTP_LENGTH = 6
const RESEND_SECONDS = 30

// Inner component uses useSearchParams — must be wrapped in Suspense
function VerifyOTPInner() {
  const router       = useRouter()
  const params       = useSearchParams()
  const phone        = params.get('phone') ?? ''
  const flow         = params.get('flow') ?? 'register'

  const [otp,      setOtp]      = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [verified, setVerified] = useState(false)
  const [resendSec,setResendSec]= useState(RESEND_SECONDS)
  const [resending,setResending]= useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendSec <= 0) return
    const t = setTimeout(() => setResendSec(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendSec])

  useEffect(() => {
    if (otp.every(d => d !== '')) handleVerify()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    setError('')
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const next = [...otp]; next[index] = ''; setOtp(next)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft'  && index > 0)              inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = [...otp]
    pasted.split('').forEach((d, i) => { next[i] = d })
    setOtp(next)
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleVerify = useCallback(async () => {
    const code = otp.join('')
    if (code.length < OTP_LENGTH) return
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 1000))
    if (code === '000000') {
      setError('Invalid OTP. Please try again.')
      setLoading(false)
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
      return
    }
    setLoading(false)
    setVerified(true)
    await new Promise(r => setTimeout(r, 1200))
    router.push(flow === 'login' ? '/dashboard' : '/onboarding')
  }, [otp, flow, router])

  async function handleResend() {
    setResending(true)
    await new Promise(r => setTimeout(r, 800))
    setResending(false)
    setResendSec(RESEND_SECONDS)
    setOtp(Array(OTP_LENGTH).fill(''))
    setError('')
    inputRefs.current[0]?.focus()
  }

  if (verified) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-brand-green" strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-2xl font-bold text-brand-ink mb-2">Verified! ✓</h2>
        <p className="text-gray-500 text-sm">
          {flow === 'login' ? 'Logging you in…' : 'Setting up your account…'}
        </p>
        <div className="mt-6 flex justify-center">
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-gray-400 hover:text-brand-teal text-sm mb-8 transition-colors group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Change number
      </button>

      <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center mb-5">
        <span className="text-2xl">📱</span>
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-ink mb-2">Enter OTP</h1>
      <p className="text-gray-500 text-sm mb-1">We sent a 6-digit code to</p>
      <p className="font-semibold text-brand-teal text-sm mb-8">
        +91 {phone.replace(/(\d{5})(\d{5})/, '$1 $2')}
      </p>

      <div className="flex gap-2.5 sm:gap-3 mb-3 justify-center" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            autoFocus={i === 0}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold rounded-xl border-2 bg-white outline-none transition-all duration-150 font-body
              ${error
                ? 'border-red-300 text-red-600 bg-red-50'
                : digit
                  ? 'border-brand-teal text-brand-teal bg-brand-surface shadow-sm shadow-brand-teal/10'
                  : 'border-gray-200 text-brand-ink focus:border-brand-teal focus:shadow-sm focus:shadow-brand-teal/10'
              }`}
          />
        ))}
      </div>

      <div className="flex gap-1 mb-6">
        {otp.map((d, i) => (
          <div key={i} className={`flex-1 h-0.5 rounded-full transition-all duration-200 ${d ? 'bg-brand-teal' : 'bg-gray-100'}`} />
        ))}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
          <span className="text-base">⚠️</span> {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-4 text-brand-teal text-sm font-medium">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Verifying…
        </div>
      )}

      <div className="mt-6 text-center">
        {resendSec > 0 ? (
          <p className="text-gray-400 text-sm">
            Resend OTP in{' '}
            <span className="font-semibold text-brand-teal tabular-nums">
              {String(Math.floor(resendSec / 60)).padStart(2, '0')}:
              {String(resendSec % 60).padStart(2, '0')}
            </span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:text-brand-teal2 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            {resending ? 'Sending…' : 'Resend OTP'}
          </button>
        )}
      </div>

      <div className="mt-4 text-center">
        <button className="text-sm text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1.5 mx-auto">
          <span>💬</span>
          Get OTP on WhatsApp instead
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Having trouble?{' '}
        <Link href="/contact" className="text-brand-teal hover:underline">Contact support</Link>
      </p>
    </div>
  )
}

// Loading skeleton shown while useSearchParams resolves
function OTPSkeleton() {
  return (
    <div className="animate-pulse text-center py-8">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 mx-auto mb-5" />
      <div className="h-7 bg-gray-100 rounded-xl w-48 mx-auto mb-3" />
      <div className="h-4 bg-gray-100 rounded w-56 mx-auto mb-8" />
      <div className="flex gap-2.5 justify-center">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="w-11 h-14 sm:w-12 sm:h-16 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

// Default export wraps inner component in Suspense (required by Next.js 14)
export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<OTPSkeleton />}>
      <VerifyOTPInner />
    </Suspense>
  )
}
