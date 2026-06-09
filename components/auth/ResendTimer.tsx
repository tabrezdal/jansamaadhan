'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'

interface ResendTimerProps {
  initialSeconds?: number
  onResend:        () => Promise<void>
  phone?:          string
}

export default function ResendTimer({
  initialSeconds = 30,
  onResend,
  phone,
}: ResendTimerProps) {
  const [seconds,   setSeconds]   = useState(initialSeconds)
  const [resending, setResending] = useState(false)
  const [sent,      setSent]      = useState(false)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  const handleResend = useCallback(async () => {
    setResending(true)
    try {
      await onResend()
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } finally {
      setResending(false)
      setSeconds(initialSeconds)
    }
  }, [onResend, initialSeconds])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="text-center space-y-3">
      {seconds > 0 ? (
        <p className="text-gray-400 text-sm">
          Resend OTP in{' '}
          <span className="font-semibold text-brand-teal tabular-nums">{mm}:{ss}</span>
        </p>
      ) : (
        <button
          onClick={handleResend}
          disabled={resending}
          className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors
            ${resending
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-brand-teal hover:text-brand-teal2'
            }`}
        >
          <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
          {resending ? 'Sending…' : sent ? '✓ OTP sent!' : 'Resend OTP'}
        </button>
      )}

      {/* WhatsApp option */}
      <div>
        <button className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors mx-auto">
          <span>💬</span>
          Get OTP on WhatsApp instead
        </button>
      </div>
    </div>
  )
}
