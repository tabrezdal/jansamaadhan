'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Bell, CreditCard, FileText, UserCheck,
  Activity, Info, ArrowRight, RefreshCw
} from 'lucide-react'

interface Notification {
  id:          string
  type:        'payment' | 'status' | 'docs' | 'ca' | 'info'
  actor:       string
  message:     string
  createdAt:   string
  orderId:     string
  orderNumber: string
  serviceName: string
  orderStatus: string
}

const TYPE_CONFIG = {
  payment: { icon: CreditCard,  color: 'text-green-600',  bg: 'bg-green-50',  label: 'Payment'  },
  status:  { icon: Activity,    color: 'text-blue-600',   bg: 'bg-blue-50',   label: 'Update'   },
  docs:    { icon: FileText,    color: 'text-amber-600',  bg: 'bg-amber-50',  label: 'Document' },
  ca:      { icon: UserCheck,   color: 'text-purple-600', bg: 'bg-purple-50', label: 'CA'       },
  info:    { icon: Info,        color: 'text-gray-500',   bg: 'bg-gray-50',   label: 'Info'     },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading,       setLoading]       = useState(true)
  const [refreshing,    setRefreshing]    = useState(false)

  async function load(showRefresh = false) {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res  = await fetch('/api/notifications')
      const data = await res.json()
      setNotifications(data.notifications ?? [])
    } catch {}
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { load() }, [])

  const grouped = notifications.reduce<Record<string, Notification[]>>((acc, n) => {
    const date = new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(n)
    return acc
  }, {})

  return (
    <div className="space-y-5 max-w-2xl">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-brand-ink">Notifications</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {notifications.length > 0 ? `${notifications.length} updates across your orders` : 'All caught up'}
          </p>
        </div>
        <button onClick={() => load(true)} disabled={refreshing}
          className="p-2 rounded-xl text-gray-400 hover:text-brand-teal hover:bg-brand-surface transition-all disabled:opacity-50">
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-gray-300" />
          </div>
          <p className="font-semibold text-gray-600 mb-1">No notifications yet</p>
          <p className="text-sm text-gray-400 mb-5">
            Order updates, payment confirmations, and CA messages will appear here.
          </p>
          <Link href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-teal text-white text-sm font-semibold rounded-xl hover:bg-brand-teal2 transition-all">
            Browse Services <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-1">{date}</p>
              <div className="space-y-2">
                {items.map(n => {
                  const cfg  = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.info
                  const Icon = cfg.icon
                  return (
                    <Link key={n.id} href={`/dashboard/orders`}
                      className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-brand-teal/30 hover:shadow-sm transition-all group">

                      <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon size={17} className={cfg.color} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${cfg.bg} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <span className="text-[11px] text-gray-400 truncate">{n.serviceName}</span>
                          <span className="text-[10px] text-gray-300 font-mono ml-auto flex-shrink-0">{n.orderNumber}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{n.message}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>

                      <ArrowRight size={14} className="text-gray-200 group-hover:text-brand-teal flex-shrink-0 mt-3 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
