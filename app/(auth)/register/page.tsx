'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight } from 'lucide-react'

export default function RegisterPage() {
  const router              = useRouter()
  const [phone,  setPhone]  = useState('')
  const [name,   setName]   = useState('')
  const [error,  setError]  = useState('')
  const [loading,setLoading]= useState(false)

  function formatPhone(raw: string) {
    return raw.replace(/\D/g, '').slice(0, 10)
  }

  function validate() {
    if (!phone)              { setError('Please enter your mobile number.'); return false }
    if (phone.length !== 10) { setError('Enter a valid 10-digit mobile number.'); return false }
    if (!/^[6-9]/.test(phone)) { setError('Enter a valid Indian mobile number (starts with 6–9).'); return false }
    setError('')
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to send OTP. Please try again.')
        setLoading(false)
        return
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }
    setLoading(false)
    const params = new URLSearchParams({ phone, role: 'customer', ...(name ? { name } : {}) })
    router.push(`/register/verify?${params.toString()}`)
  }

  return (
    <div>
      <Link href="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-brand-teal text-sm mb-5 transition-colors group">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>

      <div className="inline-flex items-center gap-2 bg-brand-surface border border-brand-teal/20 px-3 py-1.5 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
        <span className="text-xs font-medium text-brand-teal">Free account — no credit card</span>
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-ink mb-1">Create your account</h1>
      <p className="text-gray-400 text-sm mb-1">अपना मोबाइल नंबर दर्ज करें</p>
      <p className="text-gray-500 text-sm mb-5">We'll send a 6-digit OTP to verify your number.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Mobile number</label>
          <div className={`flex items-center rounded-2xl border-2 bg-white transition-all duration-150 overflow-hidden ${error ? 'border-red-300' : 'border-gray-200 focus-within:border-brand-teal'}`}>
            <div className="flex items-center gap-2 px-4 py-3.5 border-r border-gray-100 bg-gray-50 flex-shrink-0">
              <span className="text-base leading-none">🇮🇳</span>
              <span className="text-sm font-medium text-gray-600">+91</span>
            </div>
            <input
              id="phone" type="tel" inputMode="numeric" autoComplete="tel-national" autoFocus
              placeholder="98765 43210" value={phone}
              onChange={e => { setPhone(formatPhone(e.target.value)); setError('') }}
              className="flex-1 px-4 py-3.5 text-base text-brand-ink bg-transparent outline-none placeholder-gray-300"
            />
            {phone.length > 0 && (
              <span className={`px-4 text-xs font-medium flex-shrink-0 ${phone.length === 10 ? 'text-brand-green' : 'text-gray-400'}`}>
                {phone.length}/10
              </span>
            )}
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
          <input
            id="name" type="text" autoComplete="name" placeholder="Ramesh Kumar" value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-brand-teal outline-none text-sm text-brand-ink bg-white placeholder-gray-300 transition-all"
          />
        </div>

        <button type="submit" disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all ${loading ? 'bg-brand-teal/60 text-white cursor-not-allowed' : 'bg-brand-teal text-white hover:bg-brand-teal2 shadow-md hover:-translate-y-0.5'}`}>
          {loading ? 'Sending OTP…' : <> Send OTP → <ChevronRight size={18} /> </>}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-teal font-semibold hover:underline">Log in</Link>
      </p>

      <p className="text-center text-xs text-gray-400 mt-3">
        By registering you agree to our{' '}
        <Link href="/terms" className="text-brand-teal hover:underline">Terms & Privacy Policy</Link>.
      </p>
    </div>
  )
}