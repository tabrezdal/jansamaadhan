'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Briefcase, Wallet, User,
  HelpCircle, LogOut, ChevronRight, ShieldCheck
} from 'lucide-react'
import { CA_PROFILE, getCasesByStatus } from '@/lib/caData'

const ACTION_COUNT =
  getCasesByStatus('new').length + getCasesByStatus('docs_requested').length

const NAV = [
  {
    label: 'Menu',
    items: [
      { href: '/ca-portal',          icon: LayoutDashboard, label: 'Overview' },
      { href: '/ca-portal/cases',    icon: Briefcase,       label: 'Case Queue', badge: String(ACTION_COUNT) },
      { href: '/ca-portal/earnings', icon: Wallet,          label: 'Earnings' },
      { href: '/ca-portal/profile',  icon: User,            label: 'My Profile' },
    ],
  },
  {
    label: 'Support',
    items: [
      { href: '/help', icon: HelpCircle, label: 'Help & FAQ' },
    ],
  },
]

export default function CASidebar() {
  const path = usePathname()

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 z-40">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/ca-portal" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center group-hover:bg-brand-teal2 transition-colors">
            <span className="text-white font-display font-bold text-base leading-none">J</span>
          </div>
          <div>
            <div className="font-display font-bold text-brand-teal text-base leading-none">
              Jan<span className="text-brand-amber">Samaadhan</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">CA Portal</div>
          </div>
        </Link>
      </div>

      {/* Availability toggle */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-brand-surface border border-brand-teal/10">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${CA_PROFILE.available ? 'bg-brand-green animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-xs font-semibold text-brand-teal">
              {CA_PROFILE.available ? 'Accepting cases' : 'Not accepting'}
            </span>
          </div>
          <span className="text-[10px] text-gray-400">{CA_PROFILE.available ? 'On' : 'Off'}</span>
        </div>
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
                const active  = item.href === '/ca-portal'
                  ? path === item.href
                  : path.startsWith(item.href)
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
                      {item.badge && Number(item.badge) > 0 && (
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
        <Link
          href="/ca-portal/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            {CA_PROFILE.name.replace('CA ', '')[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <div className="text-sm font-semibold text-gray-800 truncate">{CA_PROFILE.name}</div>
              {CA_PROFILE.verified && <ShieldCheck size={12} className="text-brand-green flex-shrink-0" />}
            </div>
            <div className="text-[11px] text-gray-400 truncate">⭐ {CA_PROFILE.rating} · {CA_PROFILE.icaiNumber}</div>
          </div>
          <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-teal transition-colors flex-shrink-0" />
        </Link>
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