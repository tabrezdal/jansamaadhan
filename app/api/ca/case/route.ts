import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import type { OrderStatus } from '@prisma/client'

// PATCH /api/ca/case
// Body: { orderId, action, payload }
// Actions: update_status | add_note | request_docs | mark_complete | accept_case

export async function PATCH(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session || session.role !== 'ca') {
      return NextResponse.json({ error: 'Not authenticated as CA.' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where:   { phone: session.phone },
      include: { caProfile: true },
    })
    if (!user?.caProfile) {
      return NextResponse.json({ error: 'CA profile not found.' }, { status: 404 })
    }

    const { orderId, action, payload } = await req.json()
    if (!orderId || !action) {
      return NextResponse.json({ error: 'orderId and action required.' }, { status: 400 })
    }

    // Verify order belongs to this CA (or is unassigned for accept_case)
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 })

    if (action !== 'accept_case' && order.caId !== user.caProfile.id) {
      return NextResponse.json({ error: 'Not authorised for this order.' }, { status: 403 })
    }

    switch (action) {

      case 'accept_case': {
        if (order.caId) {
          return NextResponse.json({ error: 'Case already assigned.' }, { status: 409 })
        }
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data:  { caId: user.caProfile.id, status: 'IN_PROGRESS' },
          }),
          prisma.orderEvent.create({
            data: { orderId, actor: 'CA', message: `Case accepted by ${user.name ?? 'CA'}. Work in progress.` },
          }),
        ])
        break
      }

      case 'update_status': {
        const newStatus = payload?.status as OrderStatus
        const validStatuses: OrderStatus[] = ['IN_PROGRESS','DOCS_REQUESTED','READY_TO_FILE','COMPLETED']
        if (!validStatuses.includes(newStatus)) {
          return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
        }
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data:  {
              status:      newStatus,
              completedAt: newStatus === 'COMPLETED' ? new Date() : undefined,
              ackNumber:   payload?.ackNumber ?? undefined,
            },
          }),
          prisma.orderEvent.create({
            data: { orderId, actor: 'CA', message: payload?.message ?? `Status updated to ${newStatus}.` },
          }),
        ])
        break
      }

      case 'add_note': {
        const note = (payload?.note ?? '').toString().trim()
        if (!note) return NextResponse.json({ error: 'Note cannot be empty.' }, { status: 400 })
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data:  { caNotes: note },
          }),
          prisma.orderEvent.create({
            data: { orderId, actor: 'CA', message: `CA note: ${note}` },
          }),
        ])
        break
      }

      case 'request_docs': {
        const msg = (payload?.message ?? 'Additional documents requested by CA.').toString().trim()
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data:  { status: 'DOCS_REQUESTED' },
          }),
          prisma.orderEvent.create({
            data: { orderId, actor: 'CA', message: msg },
          }),
        ])
        break
      }

      case 'mark_complete': {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data:  {
              status:      'COMPLETED',
              completedAt: new Date(),
              ackNumber:   payload?.ackNumber ?? null,
            },
          }),
          prisma.orderEvent.create({
            data: { orderId, actor: 'CA', message: payload?.message ?? 'Service completed successfully.' },
          }),
        ])
        break
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/ca/case]', err)
    return NextResponse.json({ error: 'Action failed.' }, { status: 500 })
  }
}
