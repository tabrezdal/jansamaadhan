import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * POST /api/orders/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * Verifies the Razorpay payment signature and marks the order as paid in DB.
 * NEVER trust the frontend to confirm payment — always verify here.
 */
export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment fields.' }, { status: 400 })
    }

    // ── Signature verification ─────────────────────────────────────
    const secret    = process.env.RAZORPAY_KEY_SECRET ?? ''
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`
    const expected  = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      console.warn('Invalid Razorpay signature for order', razorpay_order_id)
      return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 })
    }
    // ──────────────────────────────────────────────────────────────

    // ── Update DB ─────────────────────────────────────────────────
    // await db.order.update({
    //   where:  { razorpayOrderId: razorpay_order_id },
    //   data:   {
    //     status:            'paid',
    //     razorpayPaymentId: razorpay_payment_id,
    //     paidAt:            new Date(),
    //   },
    // })
    //
    // // Trigger CA assignment job
    // await queue.add('assign-ca', { orderId: razorpay_order_id })
    //
    // // Send SMS confirmation
    // await sendSMS(user.phone, `Your ${service.name} order is confirmed! Order ID: ${razorpay_order_id}`)
    // ──────────────────────────────────────────────────────────────

    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('verify-payment error:', err)
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 500 })
  }
}
