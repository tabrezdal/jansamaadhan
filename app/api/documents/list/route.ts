import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// GET /api/documents/list
// Returns all documents for the current user across all their orders.

export async function GET(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { phone: session.phone } })
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    const documents = await prisma.orderDocument.findMany({
      where: { order: { customerId: user.id } },
      include: {
        order: {
          select: { orderNumber: true, serviceSnapshot: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      documents: documents.map(d => ({
        id:          d.id,
        docKey:      d.docKey,
        label:       d.label,
        status:      d.status,
        fileName:    d.fileName,
        fileSizeKb:  d.fileSizeKb,
        mimeType:    d.mimeType,
        uploadedAt:  d.uploadedAt,
        orderId:     d.orderId,
        orderNumber: d.order.orderNumber,
        serviceName: d.order.serviceSnapshot.name,
      })),
    })
  } catch (err) {
    console.error('[documents/list]', err)
    return NextResponse.json({ error: 'Failed to load documents.' }, { status: 500 })
  }
}
