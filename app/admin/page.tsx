import { requireAdmin } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminPage() {
  await requireAdmin()

  const [
    totalOrders, newOrders, activeOrders, completedOrders,
    totalUsers, totalCAs, verifiedCAs,
    revenueData, recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'NEW' } }),
    prisma.order.count({ where: { status: { in: ['IN_PROGRESS','DOCS_REQUESTED','READY_TO_FILE'] } } }),
    prisma.order.count({ where: { status: 'COMPLETED' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ where: { role: 'CA' } }),
    prisma.cAProfile.count({ where: { icaiVerified: true } }),
    prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amountInPaise: true } }),
    prisma.order.findMany({
      take:    8,
      orderBy: { createdAt: 'desc' },
      include: {
        serviceSnapshot: { select: { name: true, price: true } },
        customer:        { select: { name: true, phone: true } },
        ca:              { include: { user: { select: { name: true } } } },
        payment:         { select: { status: true } },
      },
    }),
  ])

  const totalRevenue = Math.round((revenueData._sum.amountInPaise ?? 0) / 100)

  const STATS = [
    { label: 'Total Orders',    value: totalOrders,    sub: `${newOrders} new · ${activeOrders} active`,    color: 'text-blue-400',   href: '/admin/orders'   },
    { label: 'Completed',       value: completedOrders, sub: 'successfully delivered',                       color: 'text-green-400',  href: '/admin/orders?status=COMPLETED' },
    { label: 'Total Revenue',   value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: 'payments confirmed', color: 'text-amber-400',  href: '/admin/payments' },
    { label: 'Customers',       value: totalUsers,     sub: 'registered accounts',                           color: 'text-purple-400', href: '/admin/users'    },
    { label: 'CAs',             value: totalCAs,       sub: `${verifiedCAs} verified`,                       color: 'text-teal-400',   href: '/admin/cas'      },
    { label: 'Unassigned',      value: newOrders,      sub: 'need CA assignment',                            color: newOrders > 0 ? 'text-red-400' : 'text-gray-400', href: '/admin/orders?status=NEW' },
  ]

  const STATUS_COLOR: Record<string, string> = {
    NEW:             'text-blue-400',
    IN_PROGRESS:     'text-indigo-400',
    DOCS_REQUESTED:  'text-amber-400',
    READY_TO_FILE:   'text-purple-400',
    COMPLETED:       'text-green-400',
    CANCELLED:       'text-gray-500',
    PENDING_PAYMENT: 'text-gray-500',
    REFUNDED:        'text-red-400',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform health at a glance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {STATS.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-gray-800 rounded-2xl border border-gray-700 p-4 hover:border-gray-600 transition-all group">
            <div className={`font-display font-bold text-2xl ${s.color} group-hover:scale-105 transition-transform`}>
              {s.value}
            </div>
            <div className="text-sm font-medium text-gray-300 mt-1">{s.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
          </Link>
        ))}
      </div>

      {/* Unassigned orders alert */}
      {newOrders > 0 && (
        <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-red-400 font-medium">
            ⚠️ {newOrders} order{newOrders > 1 ? 's' : ''} waiting for CA assignment
          </p>
          <Link href="/admin/orders?status=NEW" className="text-xs font-semibold text-red-400 hover:underline">
            Assign now →
          </Link>
        </div>
      )}

      {/* Recent orders table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-200 text-sm">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-brand-teal hover:underline">View all →</Link>
        </div>
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Service</th>
                <th className="text-left px-4 py-3">CA</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr key={o.id} className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${i === recentOrders.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-gray-300">{o.customer.name ?? `+91 ${o.customer.phone}`}</td>
                  <td className="px-4 py-3 text-gray-300">{o.serviceSnapshot.name}</td>
                  <td className="px-4 py-3 text-gray-400">{o.ca?.user.name ?? <span className="text-red-400 text-xs">Unassigned</span>}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${STATUS_COLOR[o.status] ?? 'text-gray-400'}`}>
                      {o.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-brand-teal font-semibold">₹{o.serviceSnapshot.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
