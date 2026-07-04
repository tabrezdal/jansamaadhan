// ── CA Portal server-side helpers ────────────────────────────────────
// Mirror of lib/auth.ts but for CA role. Import in CA portal server components.

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import type {
  User, Order, ServiceSnapshot, Payment,
  OrderDocument, OrderEvent, CAProfile,
} from '@prisma/client'

export type CaseWithRelations = Order & {
  serviceSnapshot: ServiceSnapshot
  payment:         Payment | null
  documents:       OrderDocument[]
  events:          OrderEvent[]
  customer:        User
}

/**
 * Get the current CA user + their CAProfile.
 * Redirects to /ca-register if not a CA session.
 */
export async function getCurrentCA(): Promise<{ user: User; profile: CAProfile }> {
  const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
  if (!session || session.role !== 'ca') redirect('/ca-register')

  const user = await prisma.user.findUnique({
    where:   { phone: session.phone },
    include: { caProfile: true },
  })

  if (!user || !user.caProfile) redirect('/ca-register')

  return { user, profile: user.caProfile }
}

/**
 * Get all cases (orders) assigned to this CA.
 */
export async function getCAcases(caId: string): Promise<CaseWithRelations[]> {
  return prisma.order.findMany({
    where:   { caId },
    include: {
      serviceSnapshot: true,
      payment:         true,
      documents:       true,
      events:          { orderBy: { createdAt: 'desc' }, take: 10 },
      customer:        true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get a single case by ID — verifies it belongs to this CA.
 */
export async function getCAcase(
  caseId: string,
  caId: string,
): Promise<CaseWithRelations | null> {
  return prisma.order.findFirst({
    where:   { id: caseId, caId },
    include: {
      serviceSnapshot: true,
      payment:         true,
      documents:       { orderBy: { createdAt: 'asc' } },
      events:          { orderBy: { createdAt: 'desc' } },
      customer:        true,
    },
  })
}

/**
 * Get new/unassigned cases that the CA can pick up.
 * Only shown if CA is available and verified.
 */
export async function getAvailableCases(): Promise<CaseWithRelations[]> {
  return prisma.order.findMany({
    where: {
      caId:   null,
      status: 'NEW',
    },
    include: {
      serviceSnapshot: true,
      payment:         true,
      documents:       true,
      events:          { orderBy: { createdAt: 'desc' }, take: 3 },
      customer:        true,
    },
    orderBy: { createdAt: 'asc' },
    take:    20,
  })
}

export function getCaseStatusConfig(status: Order['status']) {
  const map: Record<Order['status'], { label: string; color: string; bg: string; dot: string }> = {
    PENDING_PAYMENT: { label: 'Awaiting Payment', color: 'text-gray-600',   bg: 'bg-gray-50 border-gray-200',    dot: 'bg-gray-400'   },
    NEW:             { label: 'New',              color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    dot: 'bg-blue-500'   },
    IN_PROGRESS:     { label: 'In Progress',      color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200',dot: 'bg-indigo-500' },
    DOCS_REQUESTED:  { label: 'Docs Requested',   color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  dot: 'bg-amber-500'  },
    READY_TO_FILE:   { label: 'Ready to File',    color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',dot: 'bg-purple-500' },
    COMPLETED:       { label: 'Completed',        color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  dot: 'bg-green-500'  },
    CANCELLED:       { label: 'Cancelled',        color: 'text-gray-500',   bg: 'bg-gray-50 border-gray-200',    dot: 'bg-gray-400'   },
    REFUNDED:        { label: 'Refunded',         color: 'text-red-700',    bg: 'bg-red-50 border-red-200',      dot: 'bg-red-400'    },
  }
  return map[status] ?? map.NEW
}
