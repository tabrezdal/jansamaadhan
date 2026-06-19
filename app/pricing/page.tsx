import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowRight, Check, IndianRupee } from 'lucide-react'
import { ALL_SERVICES, CATEGORY_META, getPopularServices, type Category } from '@/lib/allServices'

export const metadata: Metadata = {
  title: 'Pricing — JanSamaadhan',
  description: 'Transparent, published pricing for ITR filing, PAN, Aadhaar, GST, and 95+ government and legal services — 60–80% less than local agents.',
}

const CATEGORIES = Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]

export default function PricingPage() {
  const popular = getPopularServices().slice(0, 6)
  const cheapest = [...ALL_SERVICES].sort((a, b) => a.price - b.price)[0]
  const totalServices = ALL_SERVICES.length

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFBFC] pt-16">

        {/* Hero */}
        <div className="bg-gradient-to-br from-brand-teal via-brand-teal2 to-brand-teal3 py-14 sm:py-18 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-white/70 text-base max-w-xl mx-auto mb-8">
              No subscriptions. No hidden fees. Pay only for the service you order, and only after your quote is confirmed.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Registration', value: 'Always free' },
                { label: 'Starts at', value: `₹${cheapest.price}` },
                { label: 'Total services', value: `${totalServices}+` },
              ].map(s => (
                <div key={s.label} className="bg-white/10 border border-white/15 rounded-2xl px-5 py-3 backdrop-blur-sm">
                  <div className="font-display font-bold text-white text-lg">{s.value}</div>
                  <div className="text-white/60 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most popular */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="font-display text-2xl font-bold text-brand-ink mb-1 text-center">Most Popular Services</h2>
          <p className="text-gray-500 text-sm text-center mb-8">These are what most customers start with</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popular.map(s => (
              <Link
                key={s.slug}
                href={s.phase === 1 ? `/order/${s.slug}` : `/services/${s.category}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand-teal/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-amber text-white">Popular</span>
                </div>
                <h3 className="font-semibold text-sm text-gray-800 mb-1 group-hover:text-brand-teal transition-colors">{s.name}</h3>
                <p className="text-xs text-gray-400 mb-4">{s.desc}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-display font-bold text-xl text-brand-teal">{s.priceLabel}</div>
                    <div className="text-[10px] text-gray-400 line-through">Agent: {s.agentPrice}</div>
                  </div>
                  <ArrowRight size={15} className="text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Full price list by category */}
        <div className="bg-white border-y border-gray-100 py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-brand-ink mb-8 text-center">Full Price List</h2>

            <div className="space-y-10">
              {CATEGORIES.map(([key, meta]) => {
                const services = ALL_SERVICES.filter(s => s.category === key)
                if (services.length === 0) return null
                return (
                  <div key={key}>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className={`w-9 h-9 rounded-xl ${meta.bg} border flex items-center justify-center text-base`}>{meta.emoji}</div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{meta.label}</h3>
                        <p className="text-[11px] text-gray-400">{services.length} services</p>
                      </div>
                      <Link href={`/services/${key}`} className="ml-auto text-xs text-brand-teal font-semibold hover:underline flex items-center gap-1">
                        View all <ArrowRight size={11} />
                      </Link>
                    </div>
                    <div className="rounded-2xl border border-gray-100 overflow-hidden">
                      {services.slice(0, 5).map((s, i) => (
                        <div
                          key={s.slug}
                          className={`flex items-center justify-between gap-3 px-4 py-3 ${i < Math.min(services.length, 5) - 1 ? 'border-b border-gray-50' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-sm flex-shrink-0">{s.emoji}</span>
                            <span className="text-sm text-gray-700 truncate">{s.name}</span>
                            {s.caRequired && (
                              <span className="hidden sm:inline-flex text-[10px] text-brand-teal bg-brand-surface px-1.5 py-0.5 rounded-md flex-shrink-0">CA verified</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-[11px] text-gray-400 line-through hidden sm:inline">{s.agentPrice}</span>
                            <span className="font-semibold text-brand-teal text-sm">{s.priceLabel}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* What's included */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="font-display text-2xl font-bold text-brand-ink mb-8 text-center">What's always included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Free registration — forever',
              'No subscription, pay per service',
              'ICAI-verified CA for every CA-required service',
              'Lifetime document storage in your Vault',
              'Full refund if our SLA is missed',
              'Hindi, Hinglish & English support',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Check size={13} className="text-brand-green" />
                </div>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-3xl bg-gradient-to-r from-brand-teal to-brand-teal2 p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
            <div className="relative z-10">
              <IndianRupee size={24} className="text-brand-amber mx-auto mb-3" />
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                See exact pricing for your service
              </h3>
              <p className="text-white/70 text-sm mb-6">Browse all {totalServices}+ services with upfront pricing — no surprises.</p>
              <Link href="/services" className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-amber text-white font-semibold rounded-2xl hover:bg-brand-amber2 transition-all shadow-lg">
                Browse All Services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
