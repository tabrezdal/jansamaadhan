import Link from 'next/link'
import {
  Briefcase, CheckCircle, Clock, AlertCircle,
  ArrowRight, IndianRupee, Star, Plus,
} from 'lucide-react'
import { getCurrentCA, getCAcases, getAvailableCases, getCaseStatusConfig } from '@/lib/caAuth'

export default async function CAPortalPage() {
  const { user, profile }  = await getCurrentCA()
  const cases              = await getCAcases(profile.id)
  const available          = await getAvailableCases()

  const active    = cases.filter(c => ['IN_PROGRESS','DOCS_REQUESTED','READY_TO_FILE'].includes(c.status))
  const completed = cases.filter(c => c.status === 'COMPLETED')
  const docsNeeded = cases.filter(c => c.status === 'DOCS_REQUESTED')
  const grossEarnings = completed.reduce((s, c) => s + c.serviceSnapshot.price, 0)
  const caEarnings    = Math.round(grossEarnings * 0.7)

  const displayName = user.name ?? `CA ${user.phone}`

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-teal to-brand-teal2 p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm">Welcome back</p>
            <h2 className="font-display font-bold text-white text-xl sm:text-2xl">{displayName}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-white/70 text-xs">
                <Star size={11} className="text-brand-amber fill-brand-amber" />
                {Number(profile.rating).toFixed(1)} · {profile.totalReviews} reviews
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${profile.icaiVerified ? 'bg-green-400/20 text-green-200' : 'bg-amber-400/20 text-amber-200'}`}>
                {profile.icaiVerified ? 'ICAI Verified' : 'Verification Pending'}
              </span>
            </div>
          </div>
          <Link href="/ca-portal/cases" className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-brand-amber text-white text-sm font-semibold rounded-xl hover:bg-brand-amber2 transition-all shadow-md">
            <Plus size={15} /> View Cases
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Cases',    value: active.length,    icon: Clock,        color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
          { label: 'Completed',       value: completed.length, icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
          { label: 'Docs Needed',     value: docsNeeded.length,icon: AlertCircle,  color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
          { label: 'CA Earnings',     value: `₹${caEarnings.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-4 flex items-start gap-3`}>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={17} className={s.color} />
              </div>
              <div>
                <div className={`font-display font-bold text-xl leading-none ${s.color}`}>{s.value}</div>
                <div className="text-xs font-medium text-gray-600 mt-1">{s.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Docs needed alert */}
      {docsNeeded.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 flex items-center gap-3">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-semibold text-amber-800">{docsNeeded.length} case{docsNeeded.length > 1 ? 's' : ''} waiting for documents</span>
            <span className="text-xs text-amber-700"> — Follow up with customers to keep cases moving.</span>
          </div>
          <Link href="/ca-portal/cases" className="text-xs font-semibold text-amber-700 underline whitespace-nowrap">View →</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Active cases */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm">Active Cases</h3>
            <Link href="/ca-portal/cases" className="text-xs text-brand-teal font-medium hover:underline flex items-center gap-1">
              All cases <ArrowRight size={12} />
            </Link>
          </div>

          {active.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
              <div className="text-3xl mb-3">📋</div>
              <p className="text-sm font-medium text-gray-600 mb-1">No active cases</p>
              {available.length > 0 && (
                <p className="text-xs text-gray-400 mb-4">{available.length} new case{available.length > 1 ? 's' : ''} available to accept.</p>
              )}
              <Link href="/ca-portal/cases" className="text-sm font-semibold text-brand-teal hover:underline">Browse available cases →</Link>
            </div>
          ) : (
            active.slice(0, 5).map(c => {
              const st         = getCaseStatusConfig(c.status)
              const uploaded   = c.documents.filter(d => d.status === 'UPLOADED').length
              const totalDocs  = c.documents.length
              const customerName = c.customer.name ?? `+91 ${c.customer.phone}`

              return (
                <Link key={c.id} href={`/ca-portal/cases/${c.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:border-brand-teal/30 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{c.serviceSnapshot.name}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{c.orderNumber} · {customerName}</div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${st.bg} ${st.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${c.status === 'IN_PROGRESS' ? 'animate-pulse' : ''}`} />
                      {st.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{totalDocs > 0 ? `${uploaded}/${totalDocs} docs` : 'No docs yet'}</span>
                    <span className="font-semibold text-brand-teal">₹{c.serviceSnapshot.price}</span>
                  </div>
                </Link>
              )
            })
          )}
        </div>

        {/* Available new cases */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">New Available</h3>
            <span className="text-xs font-bold text-brand-amber">{available.length} open</span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {available.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400">No new cases right now</p>
              </div>
            ) : (
              available.slice(0, 5).map((c, i) => (
                <Link key={c.id} href={`/ca-portal/cases/${c.id}`}
                  className={`flex items-center gap-3 px-4 py-3.5 hover:bg-brand-surface transition-colors group ${i < Math.min(available.length, 5) - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-700 group-hover:text-brand-teal truncate">{c.serviceSnapshot.name}</div>
                    <div className="text-[10px] text-gray-400">{c.customer.state ?? 'India'} · {c.serviceSnapshot.slaLabel}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-brand-teal">₹{Math.round(c.serviceSnapshot.price * 0.7)}</div>
                    <div className="text-[10px] text-gray-400">your share</div>
                  </div>
                </Link>
              ))
            )}
            {available.length > 5 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-center">
                <Link href="/ca-portal/cases" className="text-xs font-semibold text-brand-teal hover:underline">
                  +{available.length - 5} more cases →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent completed */}
      {completed.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Recently Completed</h3>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {completed.slice(0, 3).map((c, i) => (
              <div key={c.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < Math.min(completed.length, 3) - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={15} className="text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-700 truncate">{c.serviceSnapshot.name}</div>
                  <div className="text-[11px] text-gray-400">
                    {c.completedAt ? new Date(c.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'} · {c.customer.name ?? c.customer.phone}
                  </div>
                </div>
                <span className="font-semibold text-brand-teal text-sm">₹{Math.round(c.serviceSnapshot.price * 0.7)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
