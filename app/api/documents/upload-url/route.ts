import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeSession, COOKIE_NAME } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { buildDocumentKey, getUploadUrl } from '@/lib/storage'

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
])
const MAX_FILE_SIZE_KB = 10 * 1024

export async function POST(req: NextRequest) {
  try {
    const session = decodeSession(cookies().get(COOKIE_NAME)?.value)
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const { orderId, docKey, label, required, fileName, fileSizeKb, mimeType } = await req.json()

    if (!docKey || !fileName || !mimeType) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: 'File type not allowed. Upload PDF, JPG, PNG, or WebP.' },
        { status: 400 },
      )
    }

    if (fileSizeKb && fileSizeKb > MAX_FILE_SIZE_KB) {
      return NextResponse.json({ error: 'File too large. Maximum 10 MB.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { phone: session.phone } })
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    // Use a temp prefix when no real orderId yet (pre-payment upload)
    // The objectKey is stored in OrderState and linked to the real order after payment
    const effectiveOrderId = (!orderId || orderId === 'temp')
      ? `temp-${user.id}`
      : orderId

    // Only verify order ownership for real (non-temp) orders
    if (orderId && orderId !== 'temp') {
      const order = await prisma.order.findUnique({ where: { id: orderId } })
      if (!order) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
      }
      const isOwner = order.customerId === user.id
      const isCA    = session.role === 'ca'
      if (!isOwner && !isCA) {
        return NextResponse.json({ error: 'Not authorised.' }, { status: 403 })
      }
    }

    // Build R2/Supabase object key and get presigned upload URL
    const ext       = fileName.split('.').pop() ?? 'bin'
    const objectKey = buildDocumentKey(effectiveOrderId, docKey, ext)
    const uploadUrl = await getUploadUrl(objectKey, mimeType)

    return NextResponse.json({
      uploadUrl,
      objectKey,
      documentId: null, // no DB row yet — created when order is placed after payment
    })
  } catch (err) {
    console.error('[documents/upload-url]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate upload URL.' },
      { status: 500 },
    )
  }
}