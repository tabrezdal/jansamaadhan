import Link from 'next/link'
import {
  ArrowRight, Briefcase, Clock, CheckCircle, IndianRupee,
  AlertCircle, FileText, Star, TrendingUp, MessageCircle
} from 'lucide-react'
import {
  CA_PROFILE, CA_CASES, PAYOUTS, STATUS_META,
  getCasesByStatus,
} from '@/lib/caData'

export default function CAPortalOverview() {
  const newCases       = getCasesByStatus('new')
  const inProgress     = getCasesByStatus('in_progress')
  const docsRequested  = getCasesByStatus('docs_requested')
  const readyToFile    = getCasesByStatus('ready_to_file')
  const completed      = getCasesByStatus('completed')

  const currentPayout  = PAYOUTS.find(p => p.status === 'processing')

  const STATS = [
    { label: 'New Cases',       value: String(newCases.length),      sub: 'awaiting first action', icon: Briefcase,   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
    { label: 'Needs Action',    value: String(docsRequested.length),  sub: 'docs requested',        icon: AlertCircle, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100' },
    { label: 'In Progress',     value: String(inProgress.length + readyToFile.length), sub: 'being worked on', icon: Clock, color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
    { label: 'This Month',      value: `₹${(currentPayout?.amount ?? 0).toLocaleString('en-IN')}`, sub: `${currentPayout?.cases ?? 0} cases · ${currentPayout?.status}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  ]

  // Priority queue — high priority first, completed excluded, max 4
  const queue = [...CA_CASES]
    .filter(c => c.status !== 'completed')
    .sort((a, b) => (a.priority === 'high' ? 0 : 1) - (b.priority === 'high' ? 0 : 1))
    .slice(0, 4)

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-teal to-brand-teal2 p-5 sm:p-6 flex items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10">
          <p className="text-white/60 text-sm">Welcome back</p>
          <h2 className="font-display font-bold text-white text-xl sm:text-2xl">{CA_PROFILE.name}</h2>
          <p className="text-white/50 text-xs mt-0.5 flex items-center gap-1.5">
            <Star size={11} className="text-brand-amber fill-brand-amber" />
            {CA_PROFILE.rating} ({CA_PROFILE.totalReviews} reviews) · {CA_PROFILE.icaiNumber}
          </p>
        </div>
        <Link href="/ca-portal/cases" className="relative z-10 flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-brand-amber text-white text-sm font-semibold rounded-xl hover:bg-brand-amber2 transition-all shadow-md hover:-translate-y-0.5">
          <Briefcase size={15} /> View Queue
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-4 flex items-start gap-3`}>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={17} className={s.color} />
              </div>
              <div>
                <div className={`font-display font-bold text-xl leading-none ${s.color}`}>{s.value}</div>
                <div className="text-xs font-medium text-gray-700 mt-1">{s.label}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Urgent alert */}
      {docsRequested.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 flex items-center gap-3">
          <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-semibold text-red-800">{docsRequested.length} case{docsRequested.length > 1 ? 's' : ''} waiting on customer documents</span>
            <span className="text-xs text-red-700"> — follow up if it's been more than 24 hours.</span>
          </div>
          <Link href="/ca-portal/cases?status=docs_requested" className="flex-shrink-0 text-xs font-semibold text-red-700 underline whitespace-nowrap">View →</Link>
        </div>
      )}

      {/* Priority queue + side stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Priority queue */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm">Priority Queue</h3>
            <Link href="/ca-portal/cases" className="text-xs text-brand-teal font-medium hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>

          {queue.map(c => {
            const st = STATUS_META[c.status]
            return (
              <Link
                key={c.id}
                href={`/ca-portal/cases/${c.id}`}
                className="block bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:border-brand-teal/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-surface flex items-center justify-center text-base flex-shrink-0">
                      {c.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 text-sm">{c.service}</span>
                        {c.priority === 'high' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">Urgent</span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{c.customerName} · {c.customerCity}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color} ${st.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                    <span className="font-semibold text-brand-teal text-sm">₹{c.caShare}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-[11px] text-gray-400 font-mono">{c.orderId}</span>
                  <span className="text-[11px] text-gray-500">Due: <span className="font-semibold text-gray-700">{c.dueBy}</span></span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Side stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1.5"><CheckCircle size={13} className="text-green-500" /> Completed cases</span>
                <span className="text-sm font-bold text-gray-800">{CA_PROFILE.completedCases}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1.5"><Star size={13} className="text-brand-amber" /> Avg. rating</span>
                <span className="text-sm font-bold text-gray-800">{CA_PROFILE.rating} / 5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1.5"><TrendingUp size={13} className="text-brand-teal" /> Total cases handled</span>
                <span className="text-sm font-bold text-gray-800">{CA_PROFILE.totalCases}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1.5"><FileText size={13} className="text-purple-500" /> Member since</span>
                <span className="text-sm font-bold text-gray-800">{CA_PROFILE.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Earnings snapshot */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">Earnings</h3>
              <Link href="/ca-portal/earnings" className="text-xs text-brand-teal font-medium hover:underline flex items-center gap-1">Details <ArrowRight size={11} /></Link>
            </div>
            <div className="rounded-xl bg-brand-surface p-3.5">
              <div className="text-[11px] text-gray-500 mb-0.5">Current cycle ({currentPayout?.period})</div>
              <div className="font-display font-bold text-2xl text-brand-teal">₹{(currentPayout?.amount ?? 0).toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{currentPayout?.date}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently completed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-sm">Recently Completed</h3>
          <Link href="/ca-portal/cases?status=completed" className="text-xs text-brand-teal font-medium hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {completed.map((c, i) => (
            <Link
              key={c.id}
              href={`/ca-portal/cases/${c.id}`}
              className={`flex items-center gap-4 px-4 sm:px-5 py-3.5 hover:bg-gray-50 transition-colors ${i < completed.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={15} className="text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-700 truncate">{c.service} — {c.customerName}</div>
                <div className="text-[11px] text-gray-400">{c.orderId} {c.ackNo && `· ${c.ackNo}`}</div>
              </div>
              <span className="text-sm font-semibold text-brand-teal flex-shrink-0">₹{c.caShare}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Support nudge */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <MessageCircle size={18} className="text-green-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">Need help with a case?</div>
            <div className="text-xs text-gray-400">CA support desk replies in under 2 hours.</div>
          </div>
        </div>
        <a href="https://wa.me/918000000000"
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-xs font-semibold rounded-xl hover:bg-green-600 transition-all">
          Chat on WhatsApp
        </a>
      </div>

    </div>
  )
}