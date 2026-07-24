import Link from 'next/link'
import {
  ArrowRight, FileText, Clock, CheckCircle,
  Plus, Download, MessageCircle,
  AlertCircle, Zap, IndianRupee,
} from 'lucide-react'
import {
  getCurrentUser, getActiveOrders, getCompletedOrders,
  getStatusConfig, calculateSavings,
} from '@/lib/auth'

const QUICK_ACTIONS = [
  { label: 'File ITR-1',       sub: '₹99 · 24 hrs',  href: '/order/itr-1',            emoji: '📄' },
  { label: 'Link PAN+Aadhaar', sub: '₹49 · 1 hr',   href: '/order/pan-aadhaar-link', emoji: '🔗' },
  { label: 'Update Aadhaar',   sub: '₹99 · 2 hrs',  href: '/order/aadhaar-address',  emoji: '🪪' },
  { label: 'GST Registration', sub: '₹499 · 6 hrs', href: '/order/gst-registration', emoji: '🏢' },
  { label: 'Rent Agreement',   sub: '₹299 · 2 hrs', href: '/order/rent-agreement',   emoji: '📋' },
  { label: 'MSME / Udyam',     sub: '₹299 · 2 hrs', href: '/order/msme',             emoji: '🏭' },
]

export default async function DashboardPage() {
  const user           = await getCurrentUser()
  const activeOrders   = await getActiveOrders(user.id)
  const completedOrders = await getCompletedOrders(user.id)
  const savings        = calculateSavings(completedOrders)

  const stats = [
    { label: 'Active Orders',    value: String(activeOrders.length),   sub: 'in progress',          icon: Clock,        color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
    { label: 'Completed',        value: String(completedOrders.length), sub: 'since joining',        icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
    { label: 'Saved vs Agents',  value: savings > 0 ? `₹${savings.toLocaleString('en-IN')}` : '—', sub: 'total savings', icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Documents Stored', value: String(activeOrders.reduce((n, o) => n + o.documents.length, 0) + completedOrders.reduce((n, o) => n + o.documents.length, 0)), sub: 'in your vault', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ]

  const displayName = user.name ?? `+91 ${user.phone.slice(0, 5)} ${user.phone.slice(5)}`
  const initials    = (user.name ?? user.phone).slice(0, 1).toUpperCase()

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-teal to-brand-teal2 p-5 sm:p-6 flex items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10">
          <p className="text-white/60 text-sm">Welcome back 👋</p>
          <h2 className="font-display font-bold text-white text-xl sm:text-2xl">{displayName}</h2>
          <p className="text-white/50 text-xs mt-0.5">
            {user.state ? `${user.state} · ` : ''} +91 {user.phone}
          </p>
        </div>
        <Link href="/services" className="relative z-10 flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-brand-amber text-white text-sm font-semibold rounded-xl hover:bg-brand-amber2 transition-all shadow-md hover:-translate-y-0.5">
          <Plus size={15} /> New Service
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => {
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

      {/* ITR deadline alert */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 flex items-center gap-3">
        <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <span className="text-sm font-semibold text-amber-800">ITR filing deadline: 31 July 2026 </span>
          <span className="text-xs text-amber-700">— File early to avoid last-minute portal rush.</span>
        </div>
        <Link href="/order/itr-1" className="flex-shrink-0 text-xs font-semibold text-amber-700 underline whitespace-nowrap">File now →</Link>
      </div>

      {/* Active orders + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Active orders */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm">Active Orders</h3>
            <Link href="/dashboard/orders" className="text-xs text-brand-teal font-medium hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
              <div className="text-3xl mb-3">📋</div>
              <p className="text-sm font-medium text-gray-600 mb-1">No active orders</p>
              <p className="text-xs text-gray-400 mb-4">Start a new service to see it here.</p>
              <Link href="/services" className="text-sm font-semibold text-brand-teal hover:underline">Browse services →</Link>
            </div>
          ) : (
            activeOrders.map(order => {
              const st          = getStatusConfig(order.status)
              const uploadedDocs = order.documents.filter(d => d.status === 'UPLOADED').length
              const totalDocs    = order.documents.length
              const caName       = order.ca?.user.name ?? 'CA being assigned'
              const caInitial    = (order.ca?.user.name ?? 'C').replace('CA ', '')[0]

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:border-brand-teal/30 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{order.serviceSnapshot.name}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{order.orderNumber} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${order.status === 'IN_PROGRESS' ? 'animate-pulse' : ''}`} />
                        {st.label}
                      </span>
                      <span className="font-semibold text-brand-teal text-sm">₹{order.serviceSnapshot.price}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-gray-400">Progress</span>
                      <span className="text-[11px] font-medium text-gray-600">{st.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-teal to-blue-400 rounded-full transition-all duration-700" style={{ width: `${st.progress}%` }} />
                    </div>
                  </div>

                  {/* CA + docs */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal font-bold text-[10px]">
                        {caInitial}
                      </div>
                      <span className="text-xs text-gray-600">{caName}</span>
                      {order.ca && <span className="text-[10px] text-amber-500 font-semibold">★ {Number(order.ca.rating).toFixed(1)}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      {totalDocs > 0 && (
                        <span className={`text-[11px] font-medium ${uploadedDocs < totalDocs ? 'text-amber-600' : 'text-green-600'}`}>
                          {uploadedDocs}/{totalDocs} docs
                        </span>
                      )}
                      {order.dueBy && (
                        <span className="text-[11px] text-gray-400">
                          ETA {new Date(order.dueBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {order.status === 'DOCS_REQUESTED' && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-amber-700 flex items-center gap-1.5">
                        <AlertCircle size={12} /> Your CA needs more documents
                      </span>
                      <Link href="/dashboard/documents" className="text-xs font-semibold text-brand-teal hover:underline">Upload →</Link>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Quick actions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">Quick Start</h3>
            <Zap size={14} className="text-brand-amber" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {QUICK_ACTIONS.map((a, i) => (
              <Link key={a.href} href={a.href}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-brand-surface transition-colors group ${i < QUICK_ACTIONS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-base flex-shrink-0">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-700 group-hover:text-brand-teal truncate">{a.label}</div>
                  <div className="text-[10px] text-gray-400">{a.sub}</div>
                </div>
                <ArrowRight size={13} className="text-gray-300 group-hover:text-brand-teal group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <Link href="/services" className="text-xs font-semibold text-brand-teal flex items-center gap-1 hover:underline">
                View all 95+ services <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent completed */}
      {completedOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">Recently Completed</h3>
            <Link href="/dashboard/orders" className="text-xs text-brand-teal font-medium hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {completedOrders.slice(0, 3).map((o, i) => (
              <div key={o.id} className={`flex items-center gap-4 px-4 sm:px-5 py-3.5 hover:bg-gray-50 transition-colors ${i < Math.min(completedOrders.length, 3) - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={15} className="text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-700 truncate">{o.serviceSnapshot.name}</div>
                  <div className="text-[11px] text-gray-400">
                    {new Date(o.completedAt ?? o.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {o.orderNumber}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-semibold text-brand-teal">₹{o.serviceSnapshot.price}</span>
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-brand-teal hover:bg-brand-surface transition-all" title="Download">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Support nudge */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <MessageCircle size={18} className="text-green-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">Need help with an order?</div>
            <div className="text-xs text-gray-400">Our team replies in under 4 hours.</div>
          </div>
        </div>
        <a href="https://wa.me/919664850011"
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-xs font-semibold rounded-xl hover:bg-green-600 transition-all">
          Chat on WhatsApp
        </a>
      </div>

    </div>
  )
}
