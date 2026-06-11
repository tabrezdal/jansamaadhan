'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, FolderOpen, User,
  Bell, HelpCircle, LogOut, Plus, ChevronRight,
  Building2, CreditCard, Scale, PiggyBank
} from 'lucide-react'

const NAV = [
  {
    label: 'Menu',
    items: [
      { href: '/dashboard',           icon: LayoutDashboard, label: 'Overview' },
      { href: '/dashboard/orders',    icon: FileText,        label: 'My Orders',    badge: '2' },
      { href: '/dashboard/documents', icon: FolderOpen,      label: 'Documents' },
      { href: '/dashboard/profile',   icon: User,            label: 'My Profile' },
    ],
  },
  {
    label: 'Services',
    items: [
      { href: '/services/income-tax', icon: FileText,    label: 'Income Tax' },
      { href: '/services/gst',        icon: Building2,   label: 'GST' },
      { href: '/services/identity',   icon: CreditCard,  label: 'PAN & Aadhaar' },
      { href: '/services/legal',      icon: Scale,       label: 'Legal Docs' },
      { href: '/services/loans',      icon: PiggyBank,   label: 'Loans' },
    ],
  },
  {
    label: 'Support',
    items: [
      { href: '/dashboard/notifications', icon: Bell,       label: 'Notifications', badge: '3' },
      { href: '/help',                    icon: HelpCircle, label: 'Help & FAQ' },
    ],
  },
]

export default function DashboardSidebar() {
  const path = usePathname()

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 z-40">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center group-hover:bg-brand-teal2 transition-colors">
            <span className="text-white font-display font-bold text-base leading-none">J</span>
          </div>
          <div>
            <div className="font-display font-bold text-brand-teal text-base leading-none">
              Jan<span className="text-brand-amber">Samaadhan</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">jan samaadhan</div>
          </div>
        </Link>
      </div>

      {/* New service CTA */}
      <div className="px-4 py-4 border-b border-gray-100">
        <Link
          href="/services"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal2 transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={16} />
          New Service
        </Link>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {NAV.map(section => (
          <div key={section.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(item => {
                const Icon    = item.icon
                const active  = path === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                        ${active
                          ? 'bg-brand-teal text-white shadow-sm shadow-brand-teal/20'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-brand-teal'
                        }`}
                    >
                      <Icon size={16} className={active ? 'text-white' : 'text-gray-400 group-hover:text-brand-teal'} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                          ${active ? 'bg-white/20 text-white' : 'bg-brand-amber text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            R
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">Ramesh Kumar</div>
            <div className="text-[11px] text-gray-400 truncate">+91 98765 43210</div>
          </div>
          <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-teal transition-colors flex-shrink-0" />
        </div>
        <button
          className="flex items-center gap-2 w-full px-3 py-2 mt-1 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login' }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
