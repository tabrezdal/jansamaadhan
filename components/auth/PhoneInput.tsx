'use client'

import { forwardRef } from 'react'

interface PhoneInputProps {
  value:      string
  onChange:   (value: string) => void
  error?:     string
  disabled?:  boolean
  autoFocus?: boolean
  label?:     string
}

function formatPhone(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 10)
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, error, disabled, autoFocus, label = 'Mobile number' }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div
          className={`flex items-center rounded-2xl border-2 bg-white transition-all duration-150 overflow-hidden
            ${error
              ? 'border-red-300 shadow-sm shadow-red-100'
              : 'border-gray-200 focus-within:border-brand-teal focus-within:shadow-sm focus-within:shadow-brand-teal/10'
            }
            ${disabled ? 'opacity-60' : ''}
          `}
        >
          {/* Country code badge */}
          <div className="flex items-center gap-1.5 px-4 py-3.5 border-r border-gray-100 bg-gray-50 flex-shrink-0">
            <span className="text-base leading-none" aria-hidden>🇮🇳</span>
            <span className="text-sm font-medium text-gray-500 tabular-nums">+91</span>
          </div>

          {/* Input */}
          <input
            ref={ref}
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            autoFocus={autoFocus}
            disabled={disabled}
            placeholder="98765 43210"
            value={value}
            onChange={e => onChange(formatPhone(e.target.value))}
            className="flex-1 px-4 py-3.5 text-base text-brand-ink bg-transparent outline-none placeholder-gray-300 font-body tracking-wide disabled:cursor-not-allowed"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'phone-error' : undefined}
          />

          {/* Length indicator */}
          {value.length > 0 && (
            <span
              aria-hidden
              className={`px-3 text-xs font-semibold flex-shrink-0 tabular-nums
                ${value.length === 10 ? 'text-brand-green' : 'text-gray-300'}`}
            >
              {value.length}/10
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p id="phone-error" role="alert" className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
            <span
              aria-hidden
              className="w-3.5 h-3.5 rounded-full bg-red-100 inline-flex items-center justify-center text-[9px] font-bold flex-shrink-0"
            >
              !
            </span>
            {error}
          </p>
        )}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export default PhoneInput

// Validation helper — export for reuse in form logic
export function validateIndianPhone(phone: string): string {
  if (!phone)              return 'Please enter your mobile number.'
  if (phone.length !== 10) return 'Enter a valid 10-digit mobile number.'
  if (!/^[6-9]/.test(phone)) return 'Enter a valid Indian mobile number (starts with 6–9).'
  return ''
}
