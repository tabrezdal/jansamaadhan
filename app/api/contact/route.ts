import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, topic, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
    }

    const apiKey       = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL ?? 'dalworld.inc@gmail.com'

    if (!apiKey) {
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:     'JanSamaadhan Contact <onboarding@resend.dev>',
        to:       [contactEmail],
        reply_to: email,
        subject:  `[Contact] ${topic} — from ${name}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1A5F7A">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:bold;color:#666">Name</td><td style="padding:8px">${name}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#666">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#666">Topic</td><td style="padding:8px">${topic}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#f5f5f5;border-radius:8px">
            <p style="font-weight:bold;color:#666;margin:0 0 8px">Message</p>
            <p style="margin:0;white-space:pre-wrap">${message}</p>
          </div>
          <p style="margin-top:20px;color:#999;font-size:12px">Sent from jansamaadhan.in contact form</p>
        </div>`,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[contact] Resend error:', err)
      return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
