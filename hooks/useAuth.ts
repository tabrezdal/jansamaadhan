'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export type AuthStep = 'phone' | 'otp' | 'success' | 'error'
export type AuthFlow = 'register' | 'login'

interface AuthState {
  step:    AuthStep
  phone:   string
  loading: boolean
  error:   string
}

interface UseAuthReturn extends AuthState {
  setPhone:   (p: string) => void
  sendOTP:    (phone: string, flow: AuthFlow) => Promise<void>
  verifyOTP:  (code: string, flow: AuthFlow) => Promise<void>
  resetError: () => void
}

/**
 * useAuth — central hook for OTP-based authentication.
 *
 * Replace the simulated API calls below with real endpoints:
 *   POST /api/auth/send-otp   { phone }       → { success, requestId }
 *   POST /api/auth/verify-otp { phone, code }  → { success, token, isNewUser }
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter()

  const [state, setState] = useState<AuthState>({
    step:    'phone',
    phone:   '',
    loading: false,
    error:   '',
  })

  function setPhone(phone: string) {
    setState(s => ({ ...s, phone }))
  }

  function resetError() {
    setState(s => ({ ...s, error: '' }))
  }

  const sendOTP = useCallback(async (phone: string, flow: AuthFlow) => {
    setState(s => ({ ...s, loading: true, error: '' }))

    try {
      // ── Replace with real API call ──────────────────────────────
      // const res = await fetch('/api/auth/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone }),
      // })
      // if (!res.ok) throw new Error(await res.text())
      // ────────────────────────────────────────────────────────────

      await new Promise(r => setTimeout(r, 900)) // simulate network

      setState(s => ({ ...s, loading: false, step: 'otp', phone }))
    } catch (err: any) {
      setState(s => ({
        ...s,
        loading: false,
        error: err?.message ?? 'Failed to send OTP. Please try again.',
      }))
    }
  }, [])

  const verifyOTP = useCallback(async (code: string, flow: AuthFlow) => {
    setState(s => ({ ...s, loading: true, error: '' }))

    try {
      // ── Replace with real API call ──────────────────────────────
      // const res = await fetch('/api/auth/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone: state.phone, code }),
      // })
      // if (!res.ok) throw new Error(await res.text())
      // const { token, isNewUser } = await res.json()
      // store token in httpOnly cookie via API route
      // ────────────────────────────────────────────────────────────

      await new Promise(r => setTimeout(r, 1000)) // simulate network

      // Demo: reject 000000 as wrong OTP
      if (code === '000000') throw new Error('Invalid OTP. Please try again.')

      setState(s => ({ ...s, loading: false, step: 'success' }))

      // Brief delay for success animation, then redirect
      await new Promise(r => setTimeout(r, 1200))

      if (flow === 'register') {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setState(s => ({
        ...s,
        loading: false,
        step: 'otp',
        error: err?.message ?? 'Verification failed. Please try again.',
      }))
    }
  }, [router])

  return { ...state, setPhone, sendOTP, verifyOTP, resetError }
}
