'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, RefreshCw, CheckCircle, XCircle } from 'lucide-react'

interface CA {
  id: string; icaiNumber: string; icaiVerified: boolean; available: boolean
  rating: number; totalReviews: number; specializations: string[]
  createdAt: string
  user:   { name: string | null; phone: string; email: string | null; createdAt: string }
  _count: { assignedOrders: number }
}

export default function AdminCAsPage() {
  const [cas,     setCas]     = useState<CA[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('ALL')
  const [saving,  setSaving]  = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filter === 'VERIFIED')   params.set('verified', 'true')
    if (filter === 'UNVERIFIED') params.set('verified', 'false')
    const res = await fetch(`/api/admin/cas?${params}`)
    const data = await res.json()
    setCas(data.cas ?? [])
    setLoading(false)
  }, [search, filter])

  useEffect(() => { load() }, [load])

  async function action(caProfileId: string, act: string) {
    setSaving(caProfileId)
    await fetch('/api/admin/cas', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caProfileId, action: act }),
    })
    setSaving(null)
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">CA Partners</h1>
          <p className="text-sm text-gray-500">{cas.length} CAs registered</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Name, phone, ICAI number…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 outline-none focus:border-brand-teal placeholder-gray-600" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 outline-none focus:border-brand-teal">
          <option value="ALL">All CAs</option>
          <option value="VERIFIED">Verified</option>
          <option value="UNVERIFIED">Unverified</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-12 text-center text-gray-500">Loading…</div>
      ) : (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">CA</th>
                <th className="text-left px-4 py-3">ICAI</th>
                <th className="text-left px-4 py-3">Verified</th>
                <th className="text-left px-4 py-3">Available</th>
                <th className="text-left px-4 py-3">Cases</th>
                <th className="text-left px-4 py-3">Rating</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cas.map((ca, i) => (
                <tr key={ca.id} className={`border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors ${i === cas.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="text-gray-200 font-medium text-xs">{ca.user.name ?? '—'}</div>
                    <div className="text-gray-500 text-[10px]">+91 {ca.user.phone}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{ca.icaiNumber}</td>
                  <td className="px-4 py-3">
                    {ca.icaiVerified
                      ? <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle size={12} /> Verified</span>
                      : <span className="flex items-center gap-1 text-red-400 text-xs"><XCircle size={12} /> Pending</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${ca.available ? 'text-green-400' : 'text-gray-500'}`}>
                      {ca.available ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{ca._count.assignedOrders}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs">
                    {Number(ca.rating).toFixed(1)} ⭐ ({ca.totalReviews})
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(ca.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ca.icaiVerified ? (
                        <button onClick={() => action(ca.id, 'unverify')} disabled={saving === ca.id}
                          className="text-[10px] px-2 py-1 rounded-lg border border-red-800 text-red-400 hover:bg-red-950 transition-all disabled:opacity-50">
                          Unverify
                        </button>
                      ) : (
                        <button onClick={() => action(ca.id, 'verify')} disabled={saving === ca.id}
                          className="text-[10px] px-2 py-1 rounded-lg border border-green-800 text-green-400 hover:bg-green-950 transition-all disabled:opacity-50">
                          {saving === ca.id ? '…' : 'Verify ✓'}
                        </button>
                      )}
                      <button onClick={() => action(ca.id, 'toggle_available')} disabled={saving === ca.id}
                        className="text-[10px] px-2 py-1 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-700 transition-all disabled:opacity-50">
                        Toggle availability
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cas.length === 0 && (
            <div className="p-10 text-center text-gray-500 text-sm">No CAs found.</div>
          )}
        </div>
      )}
    </div>
  )
}
