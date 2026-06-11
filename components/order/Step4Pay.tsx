'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Shield, CheckCircle, ChevronLeft,
  Loader2, Download, LayoutDashboard
} from 'lucide-react'
import type { Service } from '@/lib/services'
import type { OrderState } from './OrderFlow'

interface Props {
  service: Service
  order:   OrderState
  onBack:  () => void
}

type PayState = 'idle' | 'loading' | 'success' | 'failed'

const UPI_APPS  = ['🔵 PhonePe', '💚 GPay', '🅿️ Paytm', '🟠 BHIM']
const PAY_TABS  = ['UPI', 'Card', 'Net Banking', 'Wallet'] as const
type  PayTab    = typeof PAY_TABS[number]

// Declare Razorpay type for window
declare global {
  interface Window { Razorpay: any }
}

export default function Step4Pay({ service, order, onBack }: Props) {
  const plan          = order.selectedPlan!
  const [tab,         setTab]     = useState<PayTab>('UPI')
  const [upiId,       setUpiId]   = useState('')
  const [payState,    setPayState]= useState<PayState>('idle')
  const [orderId,     setOrderId] = useState('')

  async function createOrder(): Promise<string> {
    // Replace with real API call:
    // const res = await fetch('/api/orders/create', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ serviceSlug: service.slug, planId: plan.id, amount: plan.price }),
    // })
    // const { razorpayOrderId } = await res.json()
    // return razorpayOrderId
    return `order_demo_${Date.now()}`
  }

  async function handleRazorpay() {
    setPayState('loading')
    try {
      const rzpOrderId = await createOrder()

      // Load Razorpay script
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src   = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload  = () => resolve()
          script.onerror = () => reject()
          document.body.appendChild(script)
        })
      }

      const options = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? 'rzp_test_xxxx',
        amount:      plan.price * 100, // paise
        currency:    'INR',
        name:        'JanSamaadhan',
        description: `${service.name} — ${plan.name}`,
        order_id:    rzpOrderId,
        prefill: {
          name:  order.name,
          email: order.email || '',
        },
        theme:       { color: '#1A5F7A' },
        modal: {
          ondismiss: () => setPayState('idle'),
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          // Verify payment server-side
          // await fetch('/api/orders/verify', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(response),
          // })
          setOrderId(response.razorpay_order_id || `JS-${Date.now()}`)
          setPayState('success')
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => setPayState('failed'))
      rzp.open()
      setPayState('idle') // reset while modal is open
    } catch {
      setPayState('failed')
    }
  }

  // ── Success screen ──────────────────────────────────────────────
  if (payState === 'success') {
    return (
      <div className="max-w-lg mx-auto text-center py-10">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={44} className="text-brand-green" strokeWidth={1.5} />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 text-sm mb-1">Your order has been placed.</p>
        <p className="text-gray-400 text-xs mb-6">Order ID: <span className="font-mono text-brand-teal">{orderId}</span></p>

        {/* What happens next */}
        <div className="bg-brand-surface rounded-2xl border border-brand-teal/20 p-5 text-left mb-6 space-y-3">
          <p className="text-xs font-semibold text-brand-teal mb-3">What happens next</p>
          {[
            { emoji: '👤', text: `A verified CA will be assigned to your ${service.name} within 1 hour.` },
            { emoji: '📲', text: 'You\'ll receive an SMS confirmation and CA contact details shortly.' },
            { emoji: `⏱️`, text: `Your service will be delivered within ${service.sla}.` },
            { emoji: '📥', text: 'All documents and acknowledgements will appear in your dashboard.' },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex items-start gap-3 text-xs text-gray-600">
              <span className="flex-shrink-0">{emoji}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-teal text-white font-semibold text-sm hover:bg-brand-teal2 transition-all shadow-sm"
          >
            <LayoutDashboard size={15} /> Go to Dashboard
          </Link>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:border-brand-teal hover:text-brand-teal transition-all"
          >
            <Download size={15} /> Download Receipt
          </button>
        </div>
      </div>
    )
  }

  // ── Payment screen ──────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Payment panel */}
      <div className="lg:col-span-2 space-y-4">

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-display font-bold text-lg text-gray-900 mb-1">Complete Payment</h2>
          <p className="text-sm text-gray-400">Secured by Razorpay · All major UPI, cards & banking accepted.</p>
        </div>

        {/* Razorpay primary button */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 text-center">
          <div className="mb-4">
            <div className="font-display font-bold text-4xl text-brand-teal mb-1">₹{plan.price}</div>
            <div className="text-sm text-gray-500">{service.name} · {plan.name} plan</div>
          </div>

          <button
            onClick={handleRazorpay}
            disabled={payState === 'loading'}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all
              ${payState === 'loading'
                ? 'bg-brand-teal/60 text-white cursor-not-allowed'
                : 'bg-brand-amber text-white hover:bg-brand-amber2 shadow-lg shadow-brand-amber/25 hover:-translate-y-0.5'
              }`}
          >
            {payState === 'loading' ? (
              <><Loader2 size={18} className="animate-spin" /> Opening payment…</>
            ) : (
              <>Pay ₹{plan.price} Securely →</>
            )}
          </button>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['UPI', 'Visa', 'Mastercard', 'RuPay', 'Net Banking', 'Wallet'].map(m => (
              <span key={m} className="text-[10px] px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 font-medium">{m}</span>
            ))}
          </div>
        </div>

        {/* UPI quick links */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pay instantly via</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {UPI_APPS.map(app => (
              <button
                key={app}
                onClick={handleRazorpay}
                className="py-3 px-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:border-brand-teal hover:bg-brand-surface hover:text-brand-teal transition-all text-center"
              >
                {app}
              </button>
            ))}
          </div>
        </div>

        {payState === 'failed' && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Payment failed or was cancelled. Please try again — your order has not been placed yet.
          </div>
        )}

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-teal transition-colors"
        >
          <ChevronLeft size={14} /> Back to review
        </button>
      </div>

      {/* Summary sidebar */}
      <div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20 space-y-4">
          <h3 className="font-semibold text-sm text-gray-800">Order Summary</h3>

          <div className="flex items-center gap-3 p-3 bg-brand-surface rounded-xl">
            <span className="text-2xl">{service.emoji}</span>
            <div>
              <div className="text-sm font-semibold text-gray-800">{service.name}</div>
              <div className="text-xs text-gray-500">{plan.name} plan</div>
            </div>
          </div>

          <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Service fee</span>
              <span>₹{plan.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Platform fee</span>
              <span className="text-brand-green">Free</span>
            </div>
            <div className="flex justify-between font-bold pt-1 border-t border-gray-100">
              <span className="text-gray-800">Total</span>
              <span className="text-brand-teal font-display text-xl">₹{plan.price}</span>
            </div>
          </div>

          {/* Guarantees */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {[
              'Delivered in ' + service.sla,
              'ICAI verified CA assigned',
              'Full refund if SLA missed',
              'Lifetime document storage',
            ].map(g => (
              <div key={g} className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle size={12} className="text-brand-green flex-shrink-0" />
                {g}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
            <Shield size={11} className="text-brand-green" />
            Razorpay · PCI-DSS Compliant
          </div>
        </div>
      </div>
    </div>
  )
}
