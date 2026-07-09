'use client'

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

interface Payment {
  id: string; status: string; amountInPaise: number
  createdAt: string; paidAt: string | null; refundedAt: string | null
  razorpayOrderId: string; razorpayPaymentId: string | null
  order: {
    orderNumber: string
    customer:        { name: string | null; phone: string }
    serviceSnapshot: { name: string }
  }
}

interface Total { status: string; _sum: { amountInPaise: number | null }; _count: { id: number } }

const STATUS_COLOR: Record<string, string> = {
  PAID:     'text-green-400 bg-green-950 border-green-800',
  CREATED:  'text-amber-400 bg-amber-950 border-amber-800',
  FAILED:   'text-red-400 bg-red-950 border-red-800',
  REFUNDED: 'text-gray-400 bg-gray-900 border-gray-700',
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [totals,   setTotals]   = useState<Total[]>([])
  const [loading,  setLoading]  = useState(true)
  const [status,   setStatus]   = useState('ALL')

  async function load() {
    setLoading(true)
    const params = new URLSearchParams()
    if (status !== 'ALL') params.set('status', status)
    const res = await fetch(`/api/admin/payments?${params}`)
    const data = await res.json()
    setPayments(data.payments ?? [])
    setTotals(data.totals ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [status])

  const totalRevenue = totals.find(t => t.status === 'PAID')?._sum.amountInPaise ?? 0
  const paidCount    = totals.find(t => t.status === 'PAID')?._count.id ?? 0
  const pendingCount = totals.find(t => t.status === 'CREATED')?._count.id ?? 0
  const failedCount  = totals.find(t => t.status === 'FAILED')?._count.id ?? 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Payments</h1>
          <p className="text-sm text-gray-500">{payments.length} payments shown</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Revenue', value: `₹${Math.round(totalRevenue / 100).toLocaleString('en-IN')}`, sub: `${paidCount} payments`, color: 'text-green-400' },
          { label: 'Pending',       value: pendingCount, sub: 'awaiting payment',  color: 'text-amber-400' },
          { label: 'Failed',        value: failedCount,  sub: 'payment failures',  color: 'text-red-400'   },
        ].map(s => (
          <div key={s.label} className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
            <div className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-300 mt-1">{s.label}</div>
            <div className="text-xs text-gray-500">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <select value={status} onChange={e => setStatus(e.target.value)}
        className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 outline-none focus:border-brand-teal">
        {['ALL','PAID','CREATED','FAILED','REFUNDED'].map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {loading ? (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-12 text-center text-gray-500">Loading…</div>
      ) : (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Service</th>
                <th className="text-left px-4 py-3">Razorpay ID</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors ${i === payments.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.order.orderNumber}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{p.order.customer.name ?? `+91 ${p.order.customer.phone}`}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.order.serviceSnapshot.name}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-gray-500">
                    {p.razorpayPaymentId ?? p.razorpayOrderId.slice(0, 16) + '…'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[p.status] ?? 'text-gray-400'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(p.paidAt ?? p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-teal">
                    ₹{Math.round(p.amountInPaise / 100).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <div className="p-10 text-center text-gray-500 text-sm">No payments found.</div>
          )}
        </div>
      )}
    </div>
  )
}
