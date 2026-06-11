import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/orders/create
 * Body: { serviceSlug, planId, amount }
 *
 * Creates a Razorpay order and returns the order ID for the frontend checkout.
 * Uncomment Razorpay SDK once RAZORPAY_KEY_SECRET is set in .env.local
 */
export async function POST(req: NextRequest) {
  try {
    const { serviceSlug, planId, amount } = await req.json()

    if (!serviceSlug || !planId || !amount) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (typeof amount !== 'number' || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 })
    }

    // ── Razorpay order creation (uncomment once key is set) ───────
    // const Razorpay = require('razorpay')
    // const rzp = new Razorpay({
    //   key_id:     process.env.RAZORPAY_KEY_ID,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET,
    // })
    //
    // const rzpOrder = await rzp.orders.create({
    //   amount:   amount * 100,   // paise
    //   currency: 'INR',
    //   receipt:  `js_${serviceSlug}_${Date.now()}`,
    //   notes:    { serviceSlug, planId },
    // })
    //
    // // Save order to DB
    // await db.order.create({
    //   data: {
    //     razorpayOrderId: rzpOrder.id,
    //     serviceSlug,
    //     planId,
    //     amount,
    //     status: 'pending',
    //     userId: getUserFromSession(req),
    //   },
    // })
    //
    // return NextResponse.json({ razorpayOrderId: rzpOrder.id })
    // ─────────────────────────────────────────────────────────────

    // Demo response
    return NextResponse.json({
      razorpayOrderId: `order_demo_${Date.now()}`,
    })

  } catch (err: any) {
    console.error('create-order error:', err)
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 })
  }
}
