'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, FolderOpen, User,
  IndianRupee, Receipt, Shield, HelpCircle,
  LogOut, ChevronRight, Bell,
} from 'lucide-react'

interface UserProfile {
  name:  string
  phone: string
}

const NAV_ITEMS = [
  { href: '/dashboard',               label: 'Overview',   icon: LayoutDashboard },
  { href: '/dashboard/orders',        label: 'My Orders',  icon: Receipt         },
  { href: '/dashboard/documents',     label: 'Documents',  icon: FolderOpen      },
  { href: '/dashboard/profile',       label: 'My Profile', icon: User            },
]

const SERVICE_LINKS = [
  { href: '/services/income-tax', label: 'Income Tax' },
  { href: '/services/gst',        label: 'GST'        },
  { href: '/services/identity',   label: 'PAN & Aadhaar' },
  { href: '/services/legal',      label: 'Legal Docs' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  const [profile,  setProfile]  = useState<UserProfile | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => {
        if (d.profile) setProfile({ name: d.profile.name, phone: d.profile.phone })
      })
      .catch(() => {})
  }, [])

  async function handleSignOut() {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const displayName = profile?.name || 'Your Account'
  const phone       = profile?.phone ? `+91 ${profile.phone}` : ''
  const initial     = (profile?.name || profile?.phone || 'U')[0].toUpperCase()

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-teal flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm leading-none">ज</span>
          </div>
          <div>
            <div className="font-display font-bold text-brand-teal text-sm leading-none">
              Jan<span className="text-brand-amber">Samaadhan</span>
            </div>
            <div className="text-[9px] text-gray-400 mt-0.5">jan samaadhan</div>
          </div>
        </Link>
      </div>

      {/* New Service CTA */}
      <div className="px-4 py-3 flex-shrink-0">
        <Link href="/services"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-teal text-white text-xs font-semibold hover:bg-brand-teal2 transition-all">
          + New Service
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Menu</p>
        <div className="space-y-0.5 mb-5">
          {NAV_ITEMS.map(item => {
            const Icon    = item.icon
            const active  = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? 'bg-brand-surface text-brand-teal'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}>
                <Icon size={16} className={active ? 'text-brand-teal' : 'text-gray-400'} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Services</p>
        <div className="space-y-0.5">
          {SERVICE_LINKS.map(s => (
            <Link key={s.href} href={s.href}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all group">
              {s.label}
              <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-400" />
            </Link>
          ))}
        </div>
      </nav>

      {/* User section — real data from /api/profile */}
      <div className="border-t border-gray-100 p-3 flex-shrink-0">
        <Link href="/dashboard/profile"
          className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors group mb-1">
          <div className="w-8 h-8 rounded-xl bg-brand-teal flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-[10px] text-gray-400 truncate">{phone}</p>
          </div>
          <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-400 flex-shrink-0" />
        </Link>

        <button
          onClick={handleSignOut}
          disabled={loggingOut}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50"
        >
          <LogOut size={14} />
          {loggingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </aside>
  )
}