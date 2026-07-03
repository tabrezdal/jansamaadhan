// ── Server-side auth helpers for dashboard pages ─────────────────────
// These run only in Server Components / Route Handlers (no 'use client').
// Import from '@/lib/auth' in any server component that needs the current user.

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import type { User, Order, ServiceSnapshot, Payment, OrderDocument, OrderEvent, CAProfile } from '@prisma/client'

export type OrderWithRelations = Order & {
  serviceSnapshot: ServiceSnapshot
  payment:         Payment | null
  documents:       OrderDocument[]
  events:          OrderEvent[]
  ca:              (CAProfile & { user: User }) | null
}

/**
 * Get the current user from the session cookie.
 * Redirects to /login if no valid session.
 * Returns null (never — always redirects) if unauthenticated.
 */
export async function getCurrentUser(): Promise<User> {
  const cookieStore = cookies()
  const sessionValue = cookieStore.get(COOKIE_NAME)?.value
  const session = decodeSession(sessionValue)

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { phone: session.phone },
  })

  if (!user) {
    redirect('/login')
  }

  return user
}

/**
 * Get active orders for the current user.
 * "Active" = not COMPLETED, CANCELLED, or REFUNDED.
 */
export async function getActiveOrders(userId: string): Promise<OrderWithRelations[]> {
  return prisma.order.findMany({
    where: {
      customerId: userId,
      status: { notIn: ['COMPLETED', 'CANCELLED', 'REFUNDED'] },
    },
    include: {
      serviceSnapshot: true,
      payment:         true,
      documents:       true,
      events:          { orderBy: { createdAt: 'desc' }, take: 5 },
      ca:              { include: { user: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get completed/historical orders for the current user.
 */
export async function getCompletedOrders(userId: string): Promise<OrderWithRelations[]> {
  return prisma.order.findMany({
    where: {
      customerId: userId,
      status: { in: ['COMPLETED', 'CANCELLED', 'REFUNDED'] },
    },
    include: {
      serviceSnapshot: true,
      payment:         true,
      documents:       true,
      events:          { orderBy: { createdAt: 'desc' }, take: 3 },
      ca:              { include: { user: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
}

/**
 * Get all orders (active + completed) for the full orders list page.
 */
export async function getAllOrders(userId: string): Promise<OrderWithRelations[]> {
  return prisma.order.findMany({
    where: { customerId: userId },
    include: {
      serviceSnapshot: true,
      payment:         true,
      documents:       true,
      events:          { orderBy: { createdAt: 'desc' }, take: 3 },
      ca:              { include: { user: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Map Prisma OrderStatus enum → display config for the dashboard UI.
 * Matches the STATUS_CONFIG object that was previously hardcoded in the page.
 */
export function getStatusConfig(status: Order['status']) {
  const map: Record<Order['status'], { label: string; color: string; bg: string; dot: string; progress: number }> = {
    PENDING_PAYMENT: { label: 'Awaiting Payment', color: 'text-gray-700',   bg: 'bg-gray-50 border-gray-200',    dot: 'bg-gray-400',   progress: 5  },
    NEW:             { label: 'Order Placed',      color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    dot: 'bg-blue-400',   progress: 15 },
    IN_PROGRESS:     { label: 'In Progress',       color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    dot: 'bg-blue-500',   progress: 60 },
    DOCS_REQUESTED:  { label: 'Docs Needed',       color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  dot: 'bg-amber-500',  progress: 30 },
    READY_TO_FILE:   { label: 'Ready to File',     color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',dot: 'bg-purple-500', progress: 80 },
    COMPLETED:       { label: 'Completed',         color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  dot: 'bg-green-500',  progress: 100},
    CANCELLED:       { label: 'Cancelled',         color: 'text-gray-500',   bg: 'bg-gray-50 border-gray-200',    dot: 'bg-gray-400',   progress: 0  },
    REFUNDED:        { label: 'Refunded',          color: 'text-red-700',    bg: 'bg-red-50 border-red-200',      dot: 'bg-red-400',    progress: 0  },
  }
  return map[status] ?? map.NEW
}

/**
 * Calculate total money saved vs agent rates.
 * Based on the serviceSnapshot price × 3 (agents charge ~3–4× our price on average).
 */
export function calculateSavings(orders: OrderWithRelations[]): number {
  return orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + (o.serviceSnapshot.price * 2), 0)
}
