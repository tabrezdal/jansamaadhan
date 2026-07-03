import Link from 'next/link'
import { CheckCircle, Clock, AlertCircle, ArrowRight, Plus, FileText } from 'lucide-react'
import { getCurrentUser, getAllOrders, getStatusConfig } from '@/lib/auth'

export default async function OrdersPage() {
  const user   = await getCurrentUser()
  const orders = await getAllOrders(user.id)

  const active    = orders.filter(o => !['COMPLETED','CANCELLED','REFUNDED'].includes(o.status))
  const completed = orders.filter(o => o.status === 'COMPLETED')
  const other     = orders.filter(o => ['CANCELLED','REFUNDED'].includes(o.status))

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-brand-ink">My Orders</h2>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/services" className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal text-white text-sm font-semibold rounded-xl hover:bg-brand-teal2 transition-all shadow-sm">
          <Plus size={15} /> New Service
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="font-semibold text-gray-700 mb-1">No orders yet</p>
          <p className="text-sm text-gray-400 mb-6">Place your first service order to get started.</p>
          <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white text-sm font-semibold rounded-xl hover:bg-brand-teal2 transition-all">
            Browse Services <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">

          {/* Active orders */}
          {active.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                <Clock size={14} className="text-blue-500" /> Active ({active.length})
              </h3>
              <div className="space-y-3">
                {active.map(order => {
                  const st        = getStatusConfig(order.status)
                  const uploaded  = order.documents.filter(d => d.status === 'UPLOADED').length
                  const totalDocs = order.documents.length
                  const caName    = order.ca?.user.name ?? 'Assigning CA…'

                  return (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand-teal/30 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="font-semibold text-gray-800">{order.serviceSnapshot.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{order.orderNumber} · {order.serviceSnapshot.planName}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${order.status === 'IN_PROGRESS' ? 'animate-pulse' : ''}`} />
                            {st.label}
                          </span>
                          <span className="font-bold text-brand-teal">₹{order.serviceSnapshot.price}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] text-gray-400">Progress</span>
                          <span className="text-[11px] font-medium text-gray-600">{st.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-teal to-blue-400 rounded-full" style={{ width: `${st.progress}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>CA: {caName}</span>
                        <div className="flex items-center gap-4">
                          {totalDocs > 0 && (
                            <span className={uploaded < totalDocs ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'}>
                              {uploaded}/{totalDocs} docs
                            </span>
                          )}
                          {order.dueBy && (
                            <span>ETA {new Date(order.dueBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          )}
                        </div>
                      </div>

                      {/* Latest event */}
                      {order.events[0] && (
                        <div className="mt-3 pt-3 border-t border-gray-50 text-[11px] text-gray-400">
                          {order.events[0].message}
                        </div>
                      )}

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
                })}
              </div>
            </div>
          )}

          {/* Completed orders */}
          {completed.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" /> Completed ({completed.length})
              </h3>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {completed.map((o, i) => (
                  <div key={o.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors ${i < completed.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={15} className="text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-700 truncate">{o.serviceSnapshot.name}</div>
                      <div className="text-[11px] text-gray-400">
                        {o.completedAt ? new Date(o.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'} · {o.orderNumber}
                        {o.ackNumber && ` · Ack: ${o.ackNumber}`}
                      </div>
                    </div>
                    <span className="font-semibold text-brand-teal text-sm flex-shrink-0">₹{o.serviceSnapshot.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancelled / Refunded */}
          {other.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-400 text-sm mb-3 flex items-center gap-2">
                <FileText size={14} /> Cancelled / Refunded ({other.length})
              </h3>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden opacity-70">
                {other.map((o, i) => {
                  const st = getStatusConfig(o.status)
                  return (
                    <div key={o.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < other.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-600 truncate">{o.serviceSnapshot.name}</div>
                        <div className="text-[11px] text-gray-400">{o.orderNumber}</div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
                      <span className="text-sm text-gray-400 flex-shrink-0">₹{o.serviceSnapshot.price}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
