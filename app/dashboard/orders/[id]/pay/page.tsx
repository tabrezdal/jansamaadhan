'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

interface OrderData {
  id:          string
  orderNumber: string
  status:      string
  serviceSnapshot: { name: string; price: number; planName: string; slaLabel: string }
  payment:     { razorpayOrderId: string; amountInPaise: number; status: string } | null
}

declare global {
  interface Window { Razorpay: any }
}

export default function ResumePayPage() {
  const params = useParams()
  const router = useRouter()
  const id     = params.id as string

  const [order,    setOrder]    = useState<OrderData | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [paying,   setPaying]   = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(d => {
        setOrder(d.order)
        setLoading(false)
        // If already paid redirect to dashboard
        if (d.order?.status !== 'PENDING_PAYMENT') {
          router.replace('/dashboard/orders')
        }
      })
      .catch(() => setLoading(false))
  }, [id, router])

  async function loadRazorpayScript(): Promise<void> {
    if (window.Razorpay) return
    return new Promise((resolve, reject) => {
      const s    = document.createElement('script')
      s.src      = 'https://checkout.razorpay.com/v1/checkout.js'
      s.onload   = () => resolve()
      s.onerror  = () => reject(new Error('Failed to load Razorpay SDK'))
      document.body.appendChild(s)
    })
  }

  async function handlePay() {
    if (!order?.payment) return
    setPaying(true)
    setError('')

    try {
      await loadRazorpayScript()

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount:      order.payment!.amountInPaise,
          currency:    'INR',
          name:        'JanSamaadhan',
          description: `${order.serviceSnapshot.name} — ${order.serviceSnapshot.planName}`,
          order_id:    order.payment!.razorpayOrderId,
          theme:       { color: '#1A5F7A' },
          modal:       { ondismiss: () => reject(new Error('dismissed')) },

          handler: async (response: {
            razorpay_payment_id: string
            razorpay_order_id:   string
            razorpay_signature:  string
          }) => {
            const verifyRes = await fetch('/api/orders/verify', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              }),
            })

            if (!verifyRes.ok) {
              const err = await verifyRes.json()
              reject(new Error(err.error ?? 'Payment verification failed.'))
              return
            }

            resolve()
          },
        })

        rzp.on('payment.failed', () => reject(new Error('payment_failed')))
        rzp.open()
      })

      setSuccess(true)
      setTimeout(() => router.push('/dashboard/orders'), 2000)

    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg === 'dismissed') {
        setPaying(false)
      } else {
        setError('Payment failed. Please try again.')
        setPaying(false)
      }
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-2 text-gray-400">
        <Loader2 size={18} className="animate-spin" /> Loading order…
      </div>
    </div>
  )

  if (!order) return (
    <div className="text-center py-16">
      <p className="text-gray-500">Order not found.</p>
      <Link href="/dashboard/orders" className="text-brand-teal text-sm mt-3 hover:underline block">← Back to orders</Link>
    </div>
  )

  if (success) return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
        <CheckCircle size={44} className="text-brand-green" strokeWidth={1.5} />
      </div>
      <h2 className="font-display font-bold text-2xl text-brand-ink mb-2">Payment Successful!</h2>
      <p className="text-gray-500 text-sm">Redirecting to your orders…</p>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto space-y-5">

      <Link href="/dashboard/orders" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-brand-teal text-sm transition-colors group">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to orders
      </Link>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Payment pending</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Your order <span className="font-mono font-medium">{order.orderNumber}</span> was created but payment was not completed. Complete payment to activate your order.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-brand-ink">Complete Payment</h2>

        <div className="flex items-center gap-4 p-4 bg-brand-surface rounded-xl">
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{order.serviceSnapshot.name}</div>
            <div className="text-xs text-gray-500">{order.serviceSnapshot.planName} · {order.serviceSnapshot.slaLabel}</div>
          </div>
          <div className="font-display font-bold text-2xl text-brand-teal">₹{order.serviceSnapshot.price}</div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={paying || !order.payment}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all
            ${paying
              ? 'bg-brand-teal/60 text-white cursor-not-allowed'
              : 'bg-brand-amber text-white hover:bg-brand-amber2 shadow-lg shadow-brand-amber/25 hover:-translate-y-0.5'
            }`}
        >
          {paying
            ? <><Loader2 size={18} className="animate-spin" /> Opening payment…</>
            : <>Pay ₹{order.serviceSnapshot.price} Securely →</>
          }
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <Shield size={11} className="text-brand-green" />
          Razorpay · PCI-DSS Compliant · Same order ID — you won't be charged twice
        </div>
      </div>
    </div>
  )
}
