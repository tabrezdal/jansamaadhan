import { IndianRupee, TrendingUp, CheckCircle, Clock } from 'lucide-react'
import { getCurrentCA, getCAcases } from '@/lib/caAuth'
import { prisma } from '@/lib/prisma'

export default async function CAEarningsPage() {
  const { user, profile } = await getCurrentCA()
  const cases             = await getCAcases(profile.id)
  const payouts           = await prisma.payout.findMany({
    where:   { caId: profile.id },
    orderBy: { createdAt: 'desc' },
  })

  const completed     = cases.filter(c => c.status === 'COMPLETED')
  const grossEarnings = completed.reduce((s, c) => s + c.serviceSnapshot.price, 0)
  const caEarnings    = Math.round(grossEarnings * 0.7)
  const pendingPayout = payouts.filter(p => p.status === 'UPCOMING' || p.status === 'PROCESSING')
    .reduce((s, p) => s + p.amount, 0)
  const totalPaid     = payouts.filter(p => p.status === 'PAID')
    .reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6 max-w-3xl">

      <div>
        <h2 className="font-display font-bold text-xl text-brand-ink">Earnings</h2>
        <p className="text-sm text-gray-500 mt-0.5">You earn 70% of every service fee. Payouts are processed monthly.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Earned',   value: `₹${caEarnings.toLocaleString('en-IN')}`,        icon: IndianRupee,  color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-100'  },
          { label: 'Cases Done',     value: completed.length,                                   icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
          { label: 'Pending Payout', value: `₹${pendingPayout.toLocaleString('en-IN')}`,      icon: Clock,        color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
          { label: 'Total Paid Out', value: `₹${totalPaid.toLocaleString('en-IN')}`,          icon: TrendingUp,   color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100'},
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

      {/* Payout history */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-sm text-gray-800">Payout History</h3>
        </div>

        {payouts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-3xl mb-3">💰</div>
            <p className="text-sm font-medium text-gray-600 mb-1">No payouts yet</p>
            <p className="text-xs text-gray-400">Complete your first cases — payouts are processed at the end of each month.</p>
          </div>
        ) : (
          payouts.map((p, i) => {
            const statusConfig = {
              UPCOMING:   { label: 'Upcoming',   color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-200'   },
              PROCESSING: { label: 'Processing', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
              PAID:       { label: 'Paid',       color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
            }[p.status] ?? { label: p.status, color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' }

            return (
              <div key={p.id} className={`flex items-center gap-4 px-5 py-4 ${i < payouts.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-800">{p.periodLabel}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{p.caseCount} case{p.caseCount !== 1 ? 's' : ''} completed</div>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <div className="font-display font-bold text-brand-teal text-lg">
                  ₹{p.amount.toLocaleString('en-IN')}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Bank details notice */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <h3 className="font-semibold text-sm text-gray-800 mb-1">Payment Details</h3>
        <p className="text-xs text-gray-500 mb-3">
          Payouts are sent to your registered bank account or UPI ID on the last working day of each month.
          Update your payment details in your profile.
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">UPI ID</span>
          <span className={profile.upiId ? 'font-medium text-gray-800' : 'text-gray-400 italic'}>
            {profile.upiId ?? 'Not set — update in profile'}
          </span>
        </div>
        {profile.bankIfsc && (
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Bank IFSC</span>
            <span className="font-medium text-gray-800">{profile.bankIfsc}</span>
          </div>
        )}
      </div>
    </div>
  )
}
