'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Plus } from 'lucide-react'

interface Payout {
  id: string; periodLabel: string; amount: number; caseCount: number
  status: string; payableDate: string | null; paidAt: string | null; createdAt: string
  ca: { id: string; icaiNumber: string; user: { name: string | null; phone: string } }
}

const STATUS_COLOR: Record<string, string> = {
  UPCOMING:   'text-blue-400 bg-blue-950 border-blue-800',
  PROCESSING: 'text-amber-400 bg-amber-950 border-amber-800',
  PAID:       'text-green-400 bg-green-950 border-green-800',
}

export default function AdminPayoutsPage() {
  const [payouts,  setPayouts]  = useState<Payout[]>([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [period,   setPeriod]   = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/payouts')
    const data = await res.json()
    setPayouts(data.payouts ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateStatus(payoutId: string, status: string) {
    setSaving(payoutId)
    await fetch('/api/admin/payouts', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payoutId, status }),
    })
    setSaving(null)
    load()
  }

  async function createPayouts() {
    if (!period.trim()) return
    setCreating(true)
    const res = await fetch('/api/admin/payouts', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ periodLabel: period.trim() }),
    })
    const data = await res.json()
    setCreating(false)
    setPeriod('')
    load()
    alert(`Created ${data.created} payout entries for period: ${period}`)
  }

  const totalPending = payouts.filter(p => p.status !== 'PAID').reduce((s, p) => s + p.amount, 0)
  const totalPaid    = payouts.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">CA Payouts</h1>
          <p className="text-sm text-gray-500">Manage monthly CA earnings payouts</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
          <div className="font-display font-bold text-2xl text-amber-400">₹{totalPending.toLocaleString('en-IN')}</div>
          <div className="text-sm text-gray-300 mt-1">Pending Payouts</div>
        </div>
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
          <div className="font-display font-bold text-2xl text-green-400">₹{totalPaid.toLocaleString('en-IN')}</div>
          <div className="text-sm text-gray-300 mt-1">Total Paid Out</div>
        </div>
      </div>

      {/* Create payout cycle */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
        <p className="text-sm font-semibold text-gray-300 mb-3">Create payout cycle for a period</p>
        <div className="flex gap-3">
          <input type="text" value={period} onChange={e => setPeriod(e.target.value)}
            placeholder="e.g. July 2026"
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-sm text-gray-200 outline-none focus:border-brand-teal placeholder-gray-500" />
          <button onClick={createPayouts} disabled={!period.trim() || creating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-teal text-white text-sm font-semibold disabled:opacity-50 hover:bg-brand-teal2 transition-all">
            <Plus size={15} /> {creating ? 'Creating…' : 'Create Payouts'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">This will create payout entries for all CAs with completed orders in this period.</p>
      </div>

      {/* Payouts table */}
      {loading ? (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-12 text-center text-gray-500">Loading…</div>
      ) : (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">CA</th>
                <th className="text-left px-4 py-3">Period</th>
                <th className="text-left px-4 py-3">Cases</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors ${i === payouts.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="text-gray-200 text-xs font-medium">{p.ca.user.name ?? '—'}</div>
                    <div className="text-gray-500 text-[10px]">+91 {p.ca.user.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{p.periodLabel}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.caseCount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[p.status] ?? 'text-gray-400'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-teal">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status !== 'PAID' && (
                      <div className="flex items-center justify-end gap-2">
                        {p.status === 'UPCOMING' && (
                          <button onClick={() => updateStatus(p.id, 'PROCESSING')} disabled={saving === p.id}
                            className="text-[10px] px-2 py-1 rounded-lg border border-amber-800 text-amber-400 hover:bg-amber-950 transition-all disabled:opacity-50">
                            Mark Processing
                          </button>
                        )}
                        <button onClick={() => updateStatus(p.id, 'PAID')} disabled={saving === p.id}
                          className="text-[10px] px-2 py-1 rounded-lg border border-green-800 text-green-400 hover:bg-green-950 transition-all disabled:opacity-50">
                          {saving === p.id ? '…' : 'Mark Paid ✓'}
                        </button>
                      </div>
                    )}
                    {p.status === 'PAID' && p.paidAt && (
                      <span className="text-[10px] text-gray-500">
                        {new Date(p.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payouts.length === 0 && (
            <div className="p-10 text-center text-gray-500 text-sm">No payouts yet. Create a payout cycle above.</div>
          )}
        </div>
      )}
    </div>
  )
}
