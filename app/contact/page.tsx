'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react'

const CHANNELS = [
  { icon: MessageCircle, title: 'WhatsApp',     value: '+91 80000 00000', sub: 'Fastest — replies in under 4 hours', href: 'https://wa.me/918000000000', color: 'bg-green-50 text-green-600' },
  { icon: Phone,         title: 'Call us',       value: '1800-XXX-XXXX',  sub: 'Toll-free · Mon–Sat, 9 AM–7 PM',     href: 'tel:18001234567',           color: 'bg-blue-50 text-blue-600' },
  { icon: Mail,          title: 'Email',         value: 'support@jansamaadhan.in', sub: 'Replies within 24 hours',   href: 'mailto:support@jansamaadhan.in', color: 'bg-amber-50 text-amber-600' },
]

const TOPICS = ['Order / Service question', 'Billing & refund', 'Partner as a CA', 'Technical issue', 'Something else']

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    // Replace with real API call — e.g. POST /api/contact
    await new Promise(r => setTimeout(r, 900))
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFBFC] pt-16">

        {/* Hero */}
        <div className="bg-brand-teal py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              We're here to help
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto">
              Order ke baare mein sawaal ho, ya kuch aur — humse baat karo. Hum हिंदी, English, aur regional languages mein help karte hain.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {CHANNELS.map(c => {
              const Icon = c.icon
              return (
                <a
                  key={c.title}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand-teal/30 hover:shadow-md transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-0.5">{c.title}</h3>
                  <p className="text-brand-teal font-semibold text-sm group-hover:underline">{c.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
                </a>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={28} className="text-brand-green" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-brand-ink mb-2">Message sent!</h3>
                    <p className="text-gray-500 text-sm">We'll get back to you within 24 hours at {form.email}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="font-display font-bold text-xl text-brand-ink mb-1">Send us a message</h2>
                    <p className="text-sm text-gray-400 mb-4">Fill the form below and our team will reach out.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Full name</label>
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Ramesh Kumar"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-teal transition-colors bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="ramesh@email.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-teal transition-colors bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Topic</label>
                      <select
                        value={form.topic}
                        onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-teal transition-colors bg-white"
                      >
                        {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us how we can help, including your Order ID if relevant…"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-teal transition-colors bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all
                        ${submitting
                          ? 'bg-brand-teal/60 text-white cursor-not-allowed'
                          : 'bg-brand-teal text-white hover:bg-brand-teal2 shadow-md shadow-brand-teal/20'
                        }`}
                    >
                      {submitting ? 'Sending…' : <>Send Message <Send size={15} /></>}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={15} className="text-brand-teal" />
                  <h3 className="font-semibold text-sm text-gray-800">Support hours</h3>
                </div>
                <p className="text-sm text-gray-500">Monday – Saturday<br />9:00 AM – 7:00 PM IST</p>
                <p className="text-xs text-gray-400 mt-2">WhatsApp messages outside these hours are answered the next business morning.</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={15} className="text-brand-teal" />
                  <h3 className="font-semibold text-sm text-gray-800">Registered office</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  JanSamaadhan Technologies Pvt. Ltd.<br />
                  Ahmedabad, Gujarat, India
                </p>
              </div>

              <div className="rounded-2xl bg-brand-surface border border-brand-teal/10 p-5">
                <p className="text-sm font-semibold text-brand-teal mb-1.5">Already have an order?</p>
                <p className="text-xs text-gray-500 mb-3">Track status and message your CA directly from your dashboard.</p>
                <a href="/dashboard/orders" className="text-xs font-semibold text-brand-teal hover:underline">Go to My Orders →</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
