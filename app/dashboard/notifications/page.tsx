'use client'

import { useState } from 'react'
import { Bell, CheckCheck, AlertCircle, Clock, Info, X, CheckCircle } from 'lucide-react'

type NotifType = 'action' | 'update' | 'deadline' | 'info' | 'success'

interface Notif {
  id:     string
  type:   NotifType
  title:  string
  body:   string
  time:   string
  read:   boolean
  href?:  string
}

const INITIAL: Notif[] = [
  { id: 'n1', type: 'action',   title: 'Upload required — ITR-2',             body: 'CA Priya Mehta needs your Form 26AS to continue your ITR-2 filing. Upload by 6 PM today.',    time: '2 hours ago',   read: false, href: '/dashboard/orders/ORD-2025-0041' },
  { id: 'n2', type: 'update',   title: 'GST Application submitted',           body: 'Your GST registration application has been submitted on the GSTN portal. ARN expected within 24 hours.', time: '5 hours ago',   read: false, href: '/dashboard/orders/ORD-2025-0040' },
  { id: 'n3', type: 'deadline', title: 'ITR filing deadline — 31 July 2025',  body: 'The last date to file your Income Tax Return for AY 2025-26 is 31 July. File now to avoid a ₹5,000 penalty.', time: '1 day ago',     read: false, href: '/order/itr-1' },
  { id: 'n4', type: 'success',  title: 'PAN-Aadhaar Linking complete',        body: 'Your PAN (ABCPK1234D) has been successfully linked with Aadhaar. Acknowledgement saved to Documents.', time: '3 days ago',    read: true,  href: '/dashboard/documents' },
  { id: 'n5', type: 'deadline', title: 'GSTR-3B due on 20 July',             body: 'Monthly GSTR-3B return for June 2025 is due on 20 July. Add GST return filing to avoid late fees.', time: '4 days ago',    read: true,  href: '/order/gstr-3b' },
  { id: 'n6', type: 'update',   title: 'ITR-1 filed successfully',            body: 'Your Income Tax Return for AY 2025-26 has been filed. ITR-V sent to your email and saved to Documents.', time: '2 weeks ago',   read: true,  href: '/dashboard/orders/ORD-2025-0035' },
  { id: 'n7', type: 'info',     title: 'New service: Credit Score Review',    body: 'Check and fix your CIBIL score for just ₹199. Helps you get better loan rates. Available now.', time: '3 weeks ago',   read: true,  href: '/order/cibil' },
  { id: 'n8', type: 'success',  title: 'Udyam certificate delivered',         body: 'Your MSME/Udyam registration is complete. Certificate saved to your Document Vault.', time: '2 months ago',  read: true,  href: '/dashboard/documents' },
]

const TYPE_CFG: Record<NotifType, { icon: typeof AlertCircle; color: string; bg: string }> = {
  action:   { icon: AlertCircle,  color: 'text-red-500',    bg: 'bg-red-50' },
  update:   { icon: Clock,        color: 'text-blue-500',   bg: 'bg-blue-50' },
  deadline: { icon: Bell,         color: 'text-amber-500',  bg: 'bg-amber-50' },
  info:     { icon: Info,         color: 'text-gray-400',   bg: 'bg-gray-50' },
  success:  { icon: CheckCircle,  color: 'text-green-500',  bg: 'bg-green-50' },
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifs.filter(n => !n.read).length

  function markAllRead() {
    setNotifs(n => n.map(x => ({ ...x, read: true })))
  }

  function dismiss(id: string) {
    setNotifs(n => n.filter(x => x.id !== id))
  }

  function markRead(id: string) {
    setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))
  }

  const filtered = notifs.filter(n => filter === 'all' || !n.read)

  return (
    <div className="space-y-5 max-w-2xl">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-teal hover:text-brand-teal2 transition-colors"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter toggle */}
      <div className="flex gap-1.5 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all
              ${filter === f
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-gray-500 hover:text-brand-teal'
              }`}
          >
            {f}
            {f === 'unread' && unreadCount > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                ${filter === 'unread' ? 'bg-white/20 text-white' : 'bg-brand-amber text-white'}`}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <Bell size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">No unread notifications</p>
            <p className="text-gray-400 text-xs mt-1">You're all caught up.</p>
          </div>
        ) : (
          filtered.map(notif => {
            const cfg  = TYPE_CFG[notif.type]
            const Icon = cfg.icon
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`relative flex gap-4 px-5 py-4 rounded-2xl border transition-all cursor-pointer group
                  ${notif.read
                    ? 'bg-white border-gray-100 hover:border-gray-200'
                    : 'bg-white border-brand-teal/20 shadow-sm shadow-brand-teal/5 hover:border-brand-teal/30'
                  }`}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <span className="absolute top-4 left-1.5 w-1.5 h-1.5 rounded-full bg-brand-teal" />
                )}

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={cfg.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-snug ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.body}</p>
                  <p className="text-[11px] text-gray-400 mt-1.5">{notif.time}</p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={e => { e.stopPropagation(); dismiss(notif.id) }}
                  className="flex-shrink-0 p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 self-start mt-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
