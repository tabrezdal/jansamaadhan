'use client'

import { useRef, useEffect, useCallback } from 'react'

interface OTPInputProps {
  length?:   number
  value:     string[]
  onChange:  (otp: string[]) => void
  onComplete?: (code: string) => void
  disabled?: boolean
  error?:    boolean
  autoFocus?: boolean
}

export default function OTPInput({
  length    = 6,
  value,
  onChange,
  onComplete,
  disabled  = false,
  error     = false,
  autoFocus = true,
}: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  const notify = useCallback((next: string[]) => {
    onChange(next)
    if (next.every(d => d !== '') && onComplete) {
      onComplete(next.join(''))
    }
  }, [onChange, onComplete])

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const next  = [...value]
    next[i]     = digit
    notify(next)
    if (digit && i < length - 1) refs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (value[i]) {
        const next = [...value]; next[i] = ''; notify(next)
      } else if (i > 0) {
        refs.current[i - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft'  && i > 0)        refs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!digits) return
    const next = Array(length).fill('')
    digits.split('').forEach((d, idx) => { next[idx] = d })
    notify(next)
    refs.current[Math.min(digits.length, length - 1)]?.focus()
  }

  return (
    <div className="space-y-3">
      {/* Input boxes */}
      <div
        className="flex justify-center gap-2 sm:gap-3"
        onPaste={handlePaste}
        role="group"
        aria-label="One-time password"
      >
        {Array.from({ length }).map((_, i) => {
          const filled  = Boolean(value[i])
          const isError = error && !value[i]

          return (
            <input
              key={i}
              ref={el => { refs.current[i] = el }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={value[i]}
              disabled={disabled}
              aria-label={`Digit ${i + 1}`}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`
                w-11 h-14 sm:w-12 sm:h-16
                text-center text-xl font-bold
                rounded-xl border-2 bg-white
                outline-none select-none
                font-body transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
                ${error
                  ? 'border-red-300 text-red-600 bg-red-50'
                  : filled
                    ? 'border-brand-teal text-brand-teal bg-brand-surface shadow-sm shadow-brand-teal/10'
                    : 'border-gray-200 text-brand-ink focus:border-brand-teal focus:shadow-sm focus:shadow-brand-teal/10'
                }
              `}
            />
          )
        })}
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5">
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 max-w-[36px] rounded-full transition-all duration-200
              ${value[i] ? 'bg-brand-teal' : 'bg-gray-100'}`}
          />
        ))}
      </div>
    </div>
  )
}
