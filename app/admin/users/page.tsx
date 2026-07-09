'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, RefreshCw } from 'lucide-react'

interface User {
  id: string; name: string | null; phone: string; email: string | null
  role: string; state: string | null; createdAt: string; lastLoginAt: string | null
  _count:    { orders: number }
  caProfile: { icaiNumber: string; icaiVerified: boolean; rating: number } | null
}

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [role,    setRole]    = useState('ALL')
  const [saving,  setSaving]  = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (role !== 'ALL') params.set('role', role)
    const res = await fetch(`/api/admin/users?${params}`)
    const data = await res.json()
    setUsers(data.users ?? [])
    setLoading(false)
  }, [search, role])

  useEffect(() => { load() }, [load])

  async function setUserRole(userId: string, newRole: string) {
    setSaving(userId)
    await fetch('/api/admin/users', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole }),
    })
    setSaving(null)
    load()
  }

  const ROLE_COLOR: Record<string, string> = {
    CUSTOMER: 'text-blue-400 bg-blue-950 border-blue-800',
    CA:       'text-teal-400 bg-teal-950 border-teal-800',
    ADMIN:    'text-amber-400 bg-amber-950 border-amber-800',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Users</h1>
          <p className="text-sm text-gray-500">{users.length} users shown</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Name, phone, email…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 outline-none focus:border-brand-teal placeholder-gray-600" />
        </div>
        <select value={role} onChange={e => setRole(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 outline-none focus:border-brand-teal">
          <option value="ALL">All roles</option>
          <option value="CUSTOMER">Customers</option>
          <option value="CA">CAs</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-12 text-center text-gray-500">Loading…</div>
      ) : (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">State</th>
                <th className="text-left px-4 py-3">Orders</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="text-left px-4 py-3">Last login</th>
                <th className="text-right px-4 py-3">Change role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={`border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors ${i === users.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="text-gray-200 text-xs font-medium">{u.name ?? '—'}</div>
                    <div className="text-gray-500 text-[10px]">+91 {u.phone}</div>
                    {u.email && <div className="text-gray-600 text-[10px]">{u.email}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_COLOR[u.role] ?? 'text-gray-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{u.state ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{u._count.orders}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={u.role}
                      onChange={e => setUserRole(u.id, e.target.value)}
                      disabled={saving === u.id}
                      className="px-2 py-1 rounded-lg bg-gray-700 border border-gray-600 text-xs text-gray-200 outline-none focus:border-brand-teal disabled:opacity-50"
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="CA">CA</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-10 text-center text-gray-500 text-sm">No users found.</div>
          )}
        </div>
      )}
    </div>
  )
}
