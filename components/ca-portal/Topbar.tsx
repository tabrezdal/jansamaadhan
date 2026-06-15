'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, Bell, Search,
  LayoutDashboard, Briefcase, Wallet, User,
  HelpCircle, LogOut, ShieldCheck
} from 'lucide-react'
import { CA_PROFILE, getCasesByStatus } from '@/lib/caData'

const ACTION_COUNT =
  getCasesByStatus('new').length + getCasesByStatus('docs_requested').length

const BREADCRUMB: Record<string, string> = {
  '/ca-portal':          'Overview',
  '/ca-portal/cases':    'Case Queue',
  '/ca-portal/earnings': 'Earnings',
  '/ca-portal/profile':  'My Profile',
}

const MOBILE_NAV = [
  { href: '/ca-portal',          icon: LayoutDashboard, label: 'Overview' },
  { href: '/ca-portal/cases',    icon: Briefcase,       label: 'Case Queue', badge: String(ACTION_COUNT) },
  { href: '/ca-portal/earnings', icon: Wallet,          label: 'Earnings' },
  { href: '/ca-portal/profile',  icon: User,            label: 'My Profile' },
  { href: '/help',               icon: HelpCircle,      label: 'Help & FAQ' },
]

export default function CATopbar() {
  const path         = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Case detail pages (/ca-portal/cases/CASE-xxxx) fall back to "Case Queue"
  const pageTitle = BREADCRUMB[path]
    ?? (path.startsWith('/ca-portal/cases/') ? 'Case Detail' : 'CA Portal')

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">

          {/* Left: mobile hamburger + page title */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="font-semibold text-gray-800 text-base">{pageTitle}</h1>
          </div>

          {/* Right: search, notifications, availability */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-brand-teal hover:bg-brand-surface transition-all"
            >
              <Search size={18} />
            </button>

            <button className="relative p-2 rounded-xl text-gray-400 hover:text-brand-teal hover:bg-brand-surface transition-all">
              <Bell size={18} />
              {ACTION_COUNT > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-amber" />
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-surface border border-brand-teal/10">
              <span className={`w-2 h-2 rounded-full ${CA_PROFILE.available ? 'bg-brand-green animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-xs font-semibold text-brand-teal">
                {CA_PROFILE.available ? 'Accepting cases' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Search bar (expandable) */}
        {searchOpen && (
          <div className="pb-3">
            <input
              autoFocus
              type="text"
              placeholder="Search cases, customers, order IDs…"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-brand-teal focus:bg-white transition-all"
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        )}
      </header>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative z-10 w-72 bg-white flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link href="/ca-portal" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="w-7 h-7 rounded-lg bg-brand-teal flex items-center justify-center">
                  <span className="text-white font-bold text-sm leading-none">J</span>
                </div>
                <div>
                  <span className="font-display font-bold text-brand-teal text-base block leading-none">
                    Jan<span className="text-brand-amber">Samaadhan</span>
                  </span>
                  <span className="text-[10px] text-gray-400">CA Portal</span>
                </div>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Availability */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-brand-surface border border-brand-teal/10">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${CA_PROFILE.available ? 'bg-brand-green animate-pulse' : 'bg-gray-300'}`} />
                  <span className="text-xs font-semibold text-brand-teal">
                    {CA_PROFILE.available ? 'Accepting cases' : 'Not accepting'}
                  </span>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="space-y-1">
                {MOBILE_NAV.map(item => {
                  const Icon   = item.icon
                  const active = item.href === '/ca-portal' ? path === item.href : path.startsWith(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                          ${active
                            ? 'bg-brand-teal text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-brand-teal'
                          }`}
                      >
                        <Icon size={16} className={active ? 'text-white' : 'text-gray-400'} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && Number(item.badge) > 0 && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                            ${active ? 'bg-white/20 text-white' : 'bg-brand-amber text-white'}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* User footer */}
            <div className="px-3 py-3 border-t border-gray-100">
              <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center text-white font-bold text-sm">
                  {CA_PROFILE.name.replace('CA ', '')[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <div className="text-sm font-semibold text-gray-800">{CA_PROFILE.name}</div>
                    {CA_PROFILE.verified && <ShieldCheck size={12} className="text-brand-green flex-shrink-0" />}
                  </div>
                  <div className="text-[11px] text-gray-400">⭐ {CA_PROFILE.rating} · {CA_PROFILE.icaiNumber}</div>
                </div>
              </div>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 mt-1 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login' }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}