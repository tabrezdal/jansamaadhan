// ── Admin server-side auth helper ────────────────────────────────────
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import type { User } from '@prisma/client'

export async function requireAdmin(): Promise<User> {
  const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({ where: { phone: session.phone } })
  if (!user || user.role !== 'ADMIN') redirect('/restricted?for=admin')

  return user
}
