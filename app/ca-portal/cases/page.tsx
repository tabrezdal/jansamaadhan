'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react'

interface Case {
  id:              string
  orderNumber:     string
  status:          string
  customerNotes:   string | null
  createdAt:       string
  dueBy:           string | null
  serviceSnapshot: { name: string; price: number; slaLabel: string; caRequired: boolean }
  customer:        { name: string | null; phone: string; state: string | null }
  documents:       { status: string }[]
  events:          { message: string; createdAt: string }[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  NEW:             { label: 'New',            color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    dot: 'bg-blue-500'   },
  IN_PROGRESS:     { label: 'In Progress',    color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200',dot: 'bg-indigo-500' },
  DOCS_REQUESTED:  { label: 'Docs Requested', color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  dot: 'bg-amber-500'  },
  READY_TO_FILE:   { label: 'Ready to File',  color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',dot: 'bg-purple-500' },
  COMPLETED:       { label: 'Completed',      color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  dot: 'bg-green-500'  },
  CANCELLED:       { label: 'Cancelled',      color: 'text-gray-500',   bg: 'bg-gray-50 border-gray-200',    dot: 'bg-gray-400'   },
}

type Tab = 'active' | 'available' | 'completed'

export default function CACasesPage() {
  const [cases,     setCases]     = useState<Case[]>([])
  const [available, setAvailable] = useState<Case[]>([])
  const [loading,   setLoading]   = useState(true)
  const [tab,       setTab]       = useState<Tab>('active')
  const [query,     setQuery]     = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/ca/cases').then(r => r.json()),
      fetch('/api/ca/available').then(r => r.json()),
    ]).then(([myCases, avail]) => {
      setCases(myCases.cases ?? [])
      setAvailable(avail.cases ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const active    = cases.filter(c => ['IN_PROGRESS','DOCS_REQUESTED','READY_TO_FILE','NEW'].includes(c.status))
  const completed = cases.filter(c => c.status === 'COMPLETED')

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: 'active',    label: 'My Active',  count: active.length    },
    { id: 'available', label: 'Available',  count: available.length },
    { id: 'completed', label: 'Completed',  count: completed.length },
  ]

  const currentList = tab === 'active' ? active : tab === 'available' ? available : completed

  const filtered = query
    ? currentList.filter(c =>
        c.serviceSnapshot.name.toLowerCase().includes(query.toLowerCase()) ||
        c.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        (c.customer.name ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : currentList

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-brand-ink">Cases</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your assigned and available service cases.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${tab === t.id ? 'bg-white text-brand-teal shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-brand-teal text-white' : 'bg-gray-200 text-gray-500'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search by service, order number, or customer…"
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-brand-teal bg-white transition-colors"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-48 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-32" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <div className="text-3xl mb-3">{tab === 'available' ? '🎯' : '📋'}</div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            {tab === 'available' ? 'No available cases right now' : `No ${tab} cases`}
          </p>
          <p className="text-xs text-gray-400">
            {tab === 'available' ? 'Check back soon — new cases are assigned here as orders come in.' : 'Cases you accept will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const st        = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.NEW
            const uploaded  = c.documents.filter(d => d.status === 'UPLOADED').length
            const totalDocs = c.documents.length
            const customer  = c.customer.name ?? `+91 ${c.customer.phone}`
            const isAvailable = tab === 'available'

            return (
              <Link key={c.id} href={`/ca-portal/cases/${c.id}`}
                className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand-teal/30 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-brand-teal transition-colors">
                      {c.serviceSnapshot.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {c.orderNumber} · {customer}
                      {c.customer.state && ` · ${c.customer.state}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>{c.serviceSnapshot.slaLabel} SLA</span>
                    {totalDocs > 0 && (
                      <span className={uploaded < totalDocs ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'}>
                        {uploaded}/{totalDocs} docs
                      </span>
                    )}
                    {c.status === 'DOCS_REQUESTED' && (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <AlertCircle size={11} /> Docs needed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {isAvailable && (
                      <span className="text-[11px] text-gray-400">
                        Your share: <span className="font-bold text-brand-teal">₹{Math.round(c.serviceSnapshot.price * 0.7)}</span>
                      </span>
                    )}
                    <span className="font-bold text-brand-teal">₹{c.serviceSnapshot.price}</span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-teal group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                {c.events[0] && tab !== 'available' && (
                  <div className="mt-2.5 pt-2.5 border-t border-gray-50 text-[11px] text-gray-400 truncate">
                    {c.events[0].message}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
