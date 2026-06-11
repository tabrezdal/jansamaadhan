'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, Bell, Search, Plus,
  LayoutDashboard, FileText, FolderOpen,
  User, HelpCircle, LogOut, Building2,
  CreditCard, Scale, PiggyBank, ChevronRight
} from 'lucide-react'

const BREADCRUMB: Record<string, string> = {
  '/dashboard':                'Overview',
  '/dashboard/orders':         'My Orders',
  '/dashboard/documents':      'Documents',
  '/dashboard/profile':        'My Profile',
  '/dashboard/notifications':  'Notifications',
}

const MOBILE_NAV = [
  { href: '/dashboard',                icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/orders',         icon: FileText,        label: 'My Orders',   badge: '2' },
  { href: '/dashboard/documents',      icon: FolderOpen,      label: 'Documents' },
  { href: '/dashboard/profile',        icon: User,            label: 'My Profile' },
  { href: '/dashboard/notifications',  icon: Bell,            label: 'Notifications', badge: '3' },
  { href: '/services',                 icon: Building2,       label: 'All Services' },
  { href: '/help',                     icon: HelpCircle,      label: 'Help & FAQ' },
]

export default function DashboardTopbar() {
  const path            = usePathname()
  const [mobileOpen,    setMobileOpen]   = useState(false)
  const [searchOpen,    setSearchOpen]   = useState(false)
  const pageTitle       = BREADCRUMB[path] ?? 'Dashboard'

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

          {/* Right: search, notification, new service */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-brand-teal hover:bg-brand-surface transition-all"
            >
              <Search size={18} />
            </button>

            {/* Notifications */}
            <Link
              href="/dashboard/notifications"
              className="relative p-2 rounded-xl text-gray-400 hover:text-brand-teal hover:bg-brand-surface transition-all"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-amber" />
            </Link>

            {/* New service — desktop */}
            <Link
              href="/services"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-brand-teal text-white text-sm font-semibold rounded-xl hover:bg-brand-teal2 transition-all shadow-sm"
            >
              <Plus size={15} />
              New Service
            </Link>
          </div>
        </div>

        {/* Search bar (expandable) */}
        {searchOpen && (
          <div className="pb-3">
            <input
              autoFocus
              type="text"
              placeholder="Search orders, services, documents…"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-brand-teal focus:bg-white transition-all"
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        )}
      </header>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="relative z-10 w-72 bg-white flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="w-7 h-7 rounded-lg bg-brand-teal flex items-center justify-center">
                  <span className="text-white font-bold text-sm leading-none">J</span>
                </div>
                <span className="font-display font-bold text-brand-teal text-base">Jan<span className="text-brand-amber">Samaadhan</span></span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* New service */}
            <div className="px-4 py-3 border-b border-gray-100">
              <Link
                href="/services"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-teal text-white text-sm font-semibold"
              >
                <Plus size={15} />
                New Service
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="space-y-1">
                {MOBILE_NAV.map(item => {
                  const Icon   = item.icon
                  const active = path === item.href
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
                        {item.badge && (
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
                <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center text-white font-bold text-sm">R</div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Ramesh Kumar</div>
                  <div className="text-[11px] text-gray-400">+91 98765 43210</div>
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
