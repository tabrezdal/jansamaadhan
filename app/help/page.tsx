'use client'

import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Search, ChevronDown, MessageCircle, LifeBuoy } from 'lucide-react'

interface FAQ { q: string; a: string; category: string }

const CATEGORIES = ['All', 'Orders', 'Payments', 'Documents', 'CA & Service Quality', 'Account & Security']

const FAQS: FAQ[] = [
  { category: 'Orders', q: 'How do I track my order status?', a: 'Go to Dashboard → My Orders. Each order shows real-time status (In Progress, Docs Pending, Completed) along with your assigned CA\'s name and a step-by-step timeline.' },
  { category: 'Orders', q: 'Can I cancel an order after placing it?', a: 'Yes, if your CA hasn\'t started substantive work yet, you get a full refund. See our Refund Policy for the exact rules once work has begun.' },
  { category: 'Orders', q: 'What happens if my SLA deadline is missed?', a: 'You get a full refund — no questions asked — if the delay was within our control. We\'ll always tell you proactively if a government portal issue is causing the delay.' },
  { category: 'Orders', q: 'Can I order a service for a family member?', a: 'Yes — many services (PAN, Aadhaar updates, ITR filing) can be ordered on behalf of a family member. Just provide their documents and details during the order, and use your own contact info for updates.' },

  { category: 'Payments', q: 'When do I actually pay?', a: 'Only after your documents are reviewed and your quote (if applicable) is confirmed. Registration is always free — you never pay just to sign up.' },
  { category: 'Payments', q: 'What payment methods are accepted?', a: 'UPI, debit/credit cards, and net banking — all processed securely through Razorpay. We never store your card or UPI credentials.' },
  { category: 'Payments', q: 'How long do refunds take?', a: 'Once approved, refunds are credited to your original payment method within 5–7 business days, depending on your bank.' },

  { category: 'Documents', q: 'What file formats can I upload?', a: 'PDF, JPG, and PNG — up to 10MB per file. Make sure scans/photos are clear and all four corners of the document are visible.' },
  { category: 'Documents', q: 'Are my documents safe?', a: 'Yes. All documents are AES-256 encrypted and stored in your personal Document Vault, accessible only to you and your assigned CA for that specific order.' },
  { category: 'Documents', q: 'Can I access old documents anytime?', a: 'Yes — your Document Vault stores filed returns, certificates, and acknowledgements for the lifetime of your account, organised by category and order.' },
  { category: 'Documents', q: 'Can I send documents over WhatsApp instead of uploading?', a: 'Yes, most order flows have a "Send via WhatsApp" option. Just mention your Order ID so we can link the documents correctly.' },

  { category: 'CA & Service Quality', q: 'Are the CAs really verified?', a: 'Every CA is checked against the ICAI membership database before they can accept a single case. You can see your assigned CA\'s name and rating on every order.' },
  { category: 'CA & Service Quality', q: 'Can I message my CA directly?', a: 'Yes — open your order from My Orders and tap "Message CA" or use the WhatsApp button to reach them directly.' },
  { category: 'CA & Service Quality', q: 'What if I\'m not happy with the CA assigned to my case?', a: 'Contact support with your Order ID and concern — we can review the case and reassign if there\'s a genuine service issue.' },

  { category: 'Account & Security', q: 'Do I need a password?', a: 'No. JanSamaadhan uses OTP-only login — we never ask for or store a password. Just your registered mobile number and a 6-digit code each time.' },
  { category: 'Account & Security', q: 'How do I update my profile details?', a: 'Go to Dashboard → My Profile to update your name, email, profession, or state. Mobile number changes require re-verification via OTP.' },
  { category: 'Account & Security', q: 'How do I delete my account?', a: 'Email privacy@jansamaadhan.in with a deletion request. We\'ll erase your personal data within 30 days, except where retention is legally required (see our Privacy Policy).' },
]

export default function HelpPage() {
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [open, setOpen] = useState<number | null>(null)

  const filtered = useMemo(() => {
    return FAQS.filter(f => {
      const matchCat = activeCat === 'All' || f.category === activeCat
      const matchQuery = !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQuery
    })
  }, [query, activeCat])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFBFC] pt-16">

        {/* Hero + search */}
        <div className="bg-brand-teal py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <LifeBuoy size={28} className="text-brand-amber mx-auto mb-4" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">How can we help?</h1>
            <p className="text-white/70 text-sm mb-6">Search our help articles or browse by topic below.</p>
            <div className="relative max-w-lg mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search — refund, documents, OTP, CA…"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-0 bg-white text-sm text-gray-800 outline-none shadow-lg placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all
                  ${activeCat === cat
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-teal/40'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm font-medium mb-1">No results for "{query}"</p>
              <p className="text-gray-400 text-xs">Try a different keyword, or contact support below.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((faq, i) => (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden
                    ${open === i ? 'border-brand-teal/30 bg-white shadow-sm' : 'border-gray-200 bg-white hover:border-brand-teal/20'}`}
                >
                  <button
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-brand-amber uppercase tracking-wider">{faq.category}</span>
                      <p className={`text-sm font-semibold leading-snug mt-0.5 ${open === i ? 'text-brand-teal' : 'text-brand-ink'}`}>{faq.q}</p>
                    </div>
                    <ChevronDown size={18} className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open === i ? 'rotate-180 text-brand-teal' : ''}`} />
                  </button>
                  <div className={`transition-all duration-200 overflow-hidden ${open === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom contact CTA */}
          <div className="mt-12 text-center bg-white rounded-2xl border border-gray-100 p-8">
            <p className="font-semibold text-brand-ink mb-1">Still need help?</p>
            <p className="text-sm text-gray-500 mb-5">Our support team replies within 4 hours on WhatsApp.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://wa.me/919664850011" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors shadow-sm">
                <MessageCircle size={15} /> Chat on WhatsApp
              </a>
              <a href="/contact" className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:border-brand-teal hover:text-brand-teal transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
