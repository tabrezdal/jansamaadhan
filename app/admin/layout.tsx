import { requireAdmin } from '@/lib/adminAuth'
import Link from 'next/link'

const NAV = [
  { href: '/admin',          label: 'Overview',  emoji: '📊' },
  { href: '/admin/orders',   label: 'Orders',    emoji: '📋' },
  { href: '/admin/cas',      label: 'CAs',       emoji: '👨‍💼' },
  { href: '/admin/users',    label: 'Users',     emoji: '👥' },
  { href: '/admin/payments', label: 'Payments',  emoji: '💳' },
  { href: '/admin/payouts',  label: 'Payouts',   emoji: '💰' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">

      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900">
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="font-display font-bold text-brand-teal text-sm">
            Jan<span className="text-brand-amber">Samaadhan</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Admin Console</div>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
              <span>{n.emoji}</span>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <div className="text-xs text-gray-500 px-2 mb-1">{admin.name ?? admin.phone}</div>
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-800 hover:text-white transition-all">
            ← Customer view
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
