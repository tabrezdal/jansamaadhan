import Link from 'next/link'
import {
  IndianRupee, TrendingUp, Wallet, Briefcase,
  CheckCircle, Clock, ArrowUpRight, ChevronRight
} from 'lucide-react'
import { PAYOUTS, CA_CASES, CA_PROFILE } from '@/lib/caData'

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  paid:       { label: 'Paid',       color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  processing: { label: 'Processing', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  upcoming:   { label: 'Upcoming',   color: 'text-gray-400',  bg: 'bg-gray-50 border-gray-200' },
}

export default function EarningsPage() {
  const paidPayouts    = PAYOUTS.filter(p => p.status === 'paid')
  const currentCycle   = PAYOUTS.find(p => p.status === 'processing')
  const lifetimeAmount = paidPayouts.reduce((sum, p) => sum + p.amount, 0)
  const lifetimeCases  = paidPayouts.reduce((sum, p) => sum + p.cases, 0)
  const avgPerCase     = lifetimeCases > 0 ? Math.round(lifetimeAmount / lifetimeCases) : 0

  const STATS = [
    { label: 'Lifetime Earnings', value: `₹${lifetimeAmount.toLocaleString('en-IN')}`, sub: `${lifetimeCases} cases paid out`, icon: Wallet,     color: 'text-brand-teal', bg: 'bg-brand-surface', border: 'border-brand-teal/10' },
    { label: 'Current Cycle',     value: `₹${(currentCycle?.amount ?? 0).toLocaleString('en-IN')}`, sub: currentCycle?.date ?? '—', icon: Clock, color: 'text-amber-600',  bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Avg. per Case',     value: `₹${avgPerCase}`, sub: 'across all paid cycles', icon: TrendingUp, color: 'text-green-600',  bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Cases Completed',   value: String(CA_PROFILE.completedCases), sub: 'all time', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ]

  // Monthly trend — chronological (oldest → newest), excludes "upcoming" placeholder
  const trend = [...PAYOUTS]
    .filter(p => p.status !== 'upcoming')
    .sort((a, b) => a.id.localeCompare(b.id))

  const maxAmount = Math.max(...trend.map(p => p.amount), 1)

  // Payout history — most recent first
  const history = [...PAYOUTS].sort((a, b) => b.id.localeCompare(a.id))

  // Per-case earnings for completed cases
  const completedCases = CA_CASES.filter(c => c.status === 'completed')

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 text-sm mt-1">Track your payouts and case-level earnings.</p>
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

      {/* Monthly trend */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-sm text-gray-800 mb-5">Monthly Trend</h3>
        <div className="flex items-end justify-between gap-3 sm:gap-6 h-40 px-2">
          {trend.map(p => {
            const heightPct = Math.max((p.amount / maxAmount) * 100, 4)
            const cfg = STATUS_CFG[p.status]
            return (
              <div key={p.id} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                <span className="text-[11px] font-semibold text-gray-600">₹{p.amount.toLocaleString('en-IN')}</span>
                <div className="w-full max-w-[48px] flex flex-col justify-end" style={{ height: '100px' }}>
                  <div
                    className={`w-full rounded-lg transition-all ${p.status === 'processing' ? 'bg-brand-amber' : 'bg-brand-teal'}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[11px] text-gray-400 font-medium">{p.period.split(' ')[0]}</span>
                {p.status === 'processing' && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border`}>{cfg.label}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Payout history */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm">Payout History</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-3">Period</div>
              <div className="col-span-3">Cases</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-3">Status</div>
            </div>
            <div className="divide-y divide-gray-50">
              {history.map(p => {
                const cfg = STATUS_CFG[p.status]
                return (
                  <div key={p.id} className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 items-center px-5 py-3.5">
                    <div className="sm:col-span-3">
                      <p className="text-sm font-medium text-gray-800">{p.period}</p>
                      <p className="text-[11px] text-gray-400">{p.date}</p>
                    </div>
                    <div className="sm:col-span-3 text-sm text-gray-600">{p.cases} case{p.cases !== 1 ? 's' : ''}</div>
                    <div className="sm:col-span-3 font-display font-bold text-base text-gray-800">₹{p.amount.toLocaleString('en-IN')}</div>
                    <div className="sm:col-span-3">
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Payout settings */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-semibold text-sm text-gray-800">Payout Details</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Bank account</span>
                <span className="font-mono text-gray-700">{CA_PROFILE.bankAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IFSC</span>
                <span className="font-mono text-gray-700">{CA_PROFILE.bankIfsc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">UPI ID</span>
                <span className="font-mono text-gray-700">{CA_PROFILE.upiId}</span>
              </div>
            </div>
            <Link href="/ca-portal/profile" className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:border-brand-teal hover:text-brand-teal transition-all">
              Update payout details <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="rounded-2xl border border-brand-teal/20 bg-brand-surface p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <IndianRupee size={14} className="text-brand-teal" />
              <p className="text-sm font-semibold text-brand-teal">Payout schedule</p>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Earnings are calculated monthly and paid out by the 5th of the following month directly to your registered bank account or UPI ID.
            </p>
          </div>
        </div>
      </div>

      {/* Per-case breakdown */}
      <div>
        <h3 className="font-semibold text-gray-800 text-sm mb-3">Completed Cases — Earnings</h3>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {completedCases.map((c, i) => (
            <Link
              key={c.id}
              href={`/ca-portal/cases/${c.id}`}
              className={`flex items-center gap-4 px-4 sm:px-5 py-3.5 hover:bg-gray-50 transition-colors group ${i < completedCases.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl bg-brand-surface flex items-center justify-center text-base flex-shrink-0">
                {c.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-700 truncate">{c.service} — {c.customerName}</div>
                <div className="text-[11px] text-gray-400">{c.orderId} {c.ackNo && `· ${c.ackNo}`}</div>
              </div>
              <span className="text-sm font-bold text-brand-teal flex-shrink-0">₹{c.caShare}</span>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-teal transition-colors flex-shrink-0" />
            </Link>
          ))}
          {completedCases.length === 0 && (
            <div className="py-12 text-center">
              <Briefcase size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No completed cases yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}