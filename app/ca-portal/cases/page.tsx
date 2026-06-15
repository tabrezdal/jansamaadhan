'use client'

import { Suspense, useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search, ChevronRight, Briefcase, AlertCircle,
  Clock, CheckCircle, FileText
} from 'lucide-react'
import { CA_CASES, STATUS_META, type CaseStatus } from '@/lib/caData'

const FILTER_TABS: { id: CaseStatus | 'all'; label: string }[] = [
  { id: 'all',            label: 'All cases' },
  { id: 'new',            label: 'New' },
  { id: 'in_progress',    label: 'In Progress' },
  { id: 'docs_requested', label: 'Docs Requested' },
  { id: 'ready_to_file',  label: 'Ready to File' },
  { id: 'completed',      label: 'Completed' },
]

const STATUS_ICON: Record<CaseStatus, typeof Briefcase> = {
  new:            Briefcase,
  in_progress:    Clock,
  docs_requested: AlertCircle,
  ready_to_file:  FileText,
  completed:      CheckCircle,
}

function CaseQueueInner() {
  const params         = useSearchParams()
  const initialStatus  = (params.get('status') as CaseStatus | 'all') ?? 'all'

  const [filter, setFilter] = useState<CaseStatus | 'all'>(
    FILTER_TABS.some(t => t.id === initialStatus) ? initialStatus : 'all'
  )
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return CA_CASES.filter(c => {
      const matchStatus = filter === 'all' || c.status === filter
      const q = search.toLowerCase()
      const matchSearch = !q ||
        c.service.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q) ||
        c.orderId.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [filter, search])

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Case Queue</h1>
        <p className="text-gray-500 text-sm mt-1">All cases assigned to you, sorted by priority and due date.</p>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1.5 bg-white border border-gray-100 rounded-xl p-1 shadow-sm overflow-x-auto">
          {FILTER_TABS.map(tab => {
            const count = tab.id === 'all' ? CA_CASES.length : CA_CASES.filter(c => c.status === tab.id).length
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                  ${filter === tab.id
                    ? 'bg-brand-teal text-white shadow-sm'
                    : 'text-gray-500 hover:text-brand-teal hover:bg-brand-surface'
                  }`}
              >
                {tab.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                  ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cases, customers, order IDs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-brand-teal focus:shadow-sm focus:shadow-brand-teal/10 transition-all"
          />
        </div>
      </div>

      {/* Case list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Briefcase size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">No cases found</p>
            <p className="text-gray-400 text-xs mt-1">Try a different filter or search term.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(c => {
              const st   = STATUS_META[c.status]
              const Icon = STATUS_ICON[c.status]
              return (
                <Link
                  key={c.id}
                  href={`/ca-portal/cases/${c.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-surface flex items-center justify-center text-lg flex-shrink-0">
                    {c.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800">{c.service}</span>
                      {c.priority === 'high' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">Urgent</span>
                      )}
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${st.bg} ${st.color} ${st.border}`}>
                        <Icon size={10} />
                        {st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 font-mono">{c.orderId}</span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400">{c.customerName}, {c.customerCity}</span>
                    </div>
                    {c.ackNo && (
                      <p className="text-[11px] text-green-600 font-mono mt-0.5">{c.ackNo}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-sm font-bold text-gray-700">₹{c.caShare}</span>
                    <span className="text-[11px] text-gray-400">Due: {c.dueBy}</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-teal transition-colors flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Loading skeleton shown while useSearchParams resolves
function CaseQueueSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div>
        <div className="h-7 bg-gray-100 rounded-xl w-40 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-72" />
      </div>
      <div className="h-10 bg-gray-100 rounded-xl w-full max-w-2xl" />
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-14 bg-gray-50 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

// Default export wraps inner component in Suspense (required by Next.js 14 for useSearchParams)
export default function CaseQueuePage() {
  return (
    <Suspense fallback={<CaseQueueSkeleton />}>
      <CaseQueueInner />
    </Suspense>
  )
}