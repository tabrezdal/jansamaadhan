'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, RefreshCw, UserCheck, AlertCircle } from 'lucide-react'

interface Order {
  id: string; orderNumber: string; status: string; priority: boolean
  createdAt: string; dueBy: string | null
  serviceSnapshot: { name: string; price: number }
  customer:        { name: string | null; phone: string; state: string | null }
  ca:              { id: string; user: { name: string | null } } | null
  payment:         { status: string; amountInPaise: number } | null
  _count:          { documents: number; events: number }
}

interface CAOption { id: string; user: { name: string | null; phone: string }; icaiNumber: string }

const STATUS_OPTIONS = ['ALL','PENDING_PAYMENT','NEW','IN_PROGRESS','DOCS_REQUESTED','READY_TO_FILE','COMPLETED','CANCELLED','REFUNDED']

const STATUS_COLOR: Record<string, string> = {
  NEW:             'text-blue-400 bg-blue-950 border-blue-800',
  IN_PROGRESS:     'text-indigo-400 bg-indigo-950 border-indigo-800',
  DOCS_REQUESTED:  'text-amber-400 bg-amber-950 border-amber-800',
  READY_TO_FILE:   'text-purple-400 bg-purple-950 border-purple-800',
  COMPLETED:       'text-green-400 bg-green-950 border-green-800',
  CANCELLED:       'text-gray-500 bg-gray-900 border-gray-700',
  PENDING_PAYMENT: 'text-gray-500 bg-gray-900 border-gray-700',
  REFUNDED:        'text-red-400 bg-red-950 border-red-800',
}

export default function AdminOrdersPage() {
  const [orders,        setOrders]        = useState<Order[]>([])
  const [cas,           setCas]           = useState<CAOption[]>([])
  const [loading,       setLoading]       = useState(true)
  const [status,        setStatus]        = useState('ALL')
  const [search,        setSearch]        = useState('')
  const [assigning,     setAssigning]     = useState<string | null>(null)
  const [selectedCA,    setSelectedCA]    = useState<Record<string, string>>({})
  const [saving,        setSaving]        = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (status !== 'ALL') params.set('status', status)
    if (search) params.set('search', search)
    const [ordRes, caRes] = await Promise.all([
      fetch(`/api/admin/orders?${params}`).then(r => r.json()),
      fetch('/api/admin/cas').then(r => r.json()),
    ])
    setOrders(ordRes.orders ?? [])
    setCas(caRes.cas ?? [])
    setLoading(false)
  }, [status, search])

  useEffect(() => { load() }, [load])

  async function assignCA(orderId: string) {
    const caProfileId = selectedCA[orderId]
    if (!caProfileId) return
    setSaving(orderId)
    await fetch('/api/admin/orders', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, action: 'assign_ca', payload: { caProfileId } }),
    })
    setSaving(null)
    setAssigning(null)
    load()
  }

  async function unassignCA(orderId: string) {
    setSaving(orderId)
    await fetch('/api/admin/orders', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, action: 'unassign_ca', payload: {} }),
    })
    setSaving(null)
    load()
  }

  async function setPriority(orderId: string, priority: boolean) {
    await fetch('/api/admin/orders', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, action: 'set_priority', payload: { priority } }),
    })
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Orders</h1>
          <p className="text-sm text-gray-500">{orders.length} orders shown</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Order number, customer, service…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 outline-none focus:border-brand-teal placeholder-gray-600" />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 outline-none focus:border-brand-teal">
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Table */}
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
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">CA</th>
                <th className="text-right px-4 py-3">₹</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <>
                  <tr key={o.id} className={`border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors ${i === orders.length - 1 && assigning !== o.id ? 'border-0' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs text-gray-400">{o.orderNumber}</div>
                      {o.priority && <span className="text-[10px] text-red-400 font-bold">URGENT</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-300 text-xs">{o.customer.name ?? `+91 ${o.customer.phone}`}</div>
                      {o.customer.state && <div className="text-gray-600 text-[10px]">{o.customer.state}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{o.serviceSnapshot.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[o.status] ?? 'text-gray-400'}`}>
                        {o.status.replace('_',' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {o.ca
                        ? <div>
                            <div className="text-gray-300 text-xs">{o.ca.user.name ?? 'CA'}</div>
                            <button onClick={() => unassignCA(o.id)} className="text-[10px] text-red-500 hover:underline">unassign</button>
                          </div>
                        : <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={11} /> None</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-right text-brand-teal font-semibold text-xs">₹{o.serviceSnapshot.price}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setPriority(o.id, !o.priority)}
                          className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${o.priority ? 'border-red-700 text-red-400 bg-red-950' : 'border-gray-700 text-gray-500 hover:border-red-700 hover:text-red-400'}`}>
                          {o.priority ? 'Urgent ✓' : 'Mark urgent'}
                        </button>
                        <button onClick={() => setAssigning(assigning === o.id ? null : o.id)}
                          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-brand-teal/50 text-brand-teal hover:bg-brand-teal/10 transition-all">
                          <UserCheck size={11} /> Assign CA
                        </button>
                      </div>
                    </td>
                  </tr>
                  {assigning === o.id && (
                    <tr key={`${o.id}-assign`} className="border-b border-gray-700/50 bg-gray-700/20">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <select
                            value={selectedCA[o.id] ?? ''}
                            onChange={e => setSelectedCA(prev => ({ ...prev, [o.id]: e.target.value }))}
                            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-sm text-gray-200 outline-none focus:border-brand-teal"
                          >
                            <option value="">Select a CA…</option>
                            {cas.map(ca => (
                              <option key={ca.id} value={ca.id}>
                                {ca.user.name ?? ca.user.phone} — ICAI: {ca.icaiNumber}
                              </option>
                            ))}
                          </select>
                          <button onClick={() => assignCA(o.id)} disabled={!selectedCA[o.id] || saving === o.id}
                            className="px-4 py-2 rounded-lg bg-brand-teal text-white text-sm font-semibold disabled:opacity-50 hover:bg-brand-teal2 transition-all">
                            {saving === o.id ? 'Assigning…' : 'Confirm'}
                          </button>
                          <button onClick={() => setAssigning(null)} className="px-3 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:bg-gray-800 transition-all">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-10 text-center text-gray-500 text-sm">No orders found.</div>
          )}
        </div>
      )}
    </div>
  )
}
