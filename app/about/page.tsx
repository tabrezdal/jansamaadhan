import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShieldCheck, Users, MapPin, Heart, Target, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us — JanSamaadhan',
  description: 'JanSamaadhan exists to make tax filing, identity services, and government compliance affordable and accessible for every Indian — especially in Tier 2 and Tier 3 cities.',
}

const STATS = [
  { num: '10,000+', label: 'Happy customers' },
  { num: '₹3.2Cr+', label: 'Saved vs agents' },
  { num: '4.8 ★',   label: 'Average rating' },
  { num: '95+',     label: 'Services offered' },
]

const VALUES = [
  { icon: ShieldCheck, title: 'Trust First',       desc: 'Every CA on our platform is ICAI-verified before they touch a single case. Your documents are encrypted, never sold, never misused.' },
  { icon: Target,      title: 'Radical Transparency', desc: 'No hidden fees, no surprise charges, no jargon. The price you see is the price you pay — before you start, not after.' },
  { icon: MapPin,      title: 'Built for Bharat',  desc: 'Hindi, Hinglish, and regional language support. We built this for the shopkeeper in Surat as much as the techie in Bengaluru.' },
  { icon: Heart,       title: 'Customer Over Commission', desc: 'Our CAs are paid for quality and speed, not for upselling you services you do not need.' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFBFC] pt-16">

        {/* Hero */}
        <div className="bg-gradient-to-br from-brand-teal via-brand-teal2 to-brand-teal3 py-16 sm:py-20 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
          />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/10">
              <Sparkles size={13} /> Our Story
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              India's Compliance, <span className="text-brand-amber">Made Simple.</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
              हर भारतीय को tax filing aur सरकारी सेवाओं का access मिले — बिना bharosa todne wale agents ke,
              बिना hidden fees ke. यही है हमारा मकसद।
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 text-center">
                <div className="font-display font-bold text-xl sm:text-2xl text-brand-teal mb-1">{s.num}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* The problem we solve */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-ink mb-5 text-center">
            Why we built JanSamaadhan
          </h2>
          <div className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
            <p>
              Every year, crores of Indians pay local agents 5–15x the fair price to file a simple ITR, link their
              PAN with Aadhaar, or register for GST — not because the work is hard, but because the system is
              confusing, and nobody tells you the actual government fee versus what you are being charged for "help".
            </p>
            <p>
              In Tier 2 and Tier 3 cities especially, this gap is wider. A shopkeeper in Rajkot or a farmer in
              Vidisha often has no easy way to know whether ₹1,200 for ITR filing is fair or whether ₹500 for a rent
              agreement is a rip-off. We started JanSamaadhan to close that gap — with transparent, published pricing,
              ICAI-verified Chartered Accountants, and a platform that explains every step in Hindi, Hinglish, and
              English.
            </p>
            <p>
              <strong className="text-brand-ink">आपकी सेवा, आपका हक</strong> — your service, your right — is not just
              our tagline. It is the belief that accessing your own government services and managing your own taxes
              should not require knowing the right person or paying an unofficial premium.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white border-y border-gray-100 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-ink mb-10 text-center">
              What we stand for
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {VALUES.map(v => {
                const Icon = v.icon
                return (
                  <div key={v.title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-brand-teal/30 hover:shadow-sm transition-all">
                    <div className="w-11 h-11 rounded-xl bg-brand-surface flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-brand-teal" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-ink text-sm mb-1">{v.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* CA network */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Users size={28} className="text-brand-teal mx-auto mb-4" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-ink mb-4">
            A network of verified professionals
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed">
            Every Chartered Accountant on JanSamaadhan is independently verified against the ICAI membership database
            before they can accept a single case. CAs earn based on the cases they complete — not commission on
            upselling — so their incentive is aligned with yours: get it done right, get it done fast.
          </p>
          <div className="mt-6">
            <a href="/ca-register" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white text-sm font-semibold rounded-2xl hover:bg-brand-teal2 transition-all shadow-sm">
              Join as a CA Partner →
            </a>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-3xl bg-gradient-to-r from-brand-teal to-brand-teal2 p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
            <div className="relative z-10">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                Ready to experience the difference?
              </h3>
              <p className="text-white/70 text-sm mb-6">Registration free hai. ₹99 se shuru karo.</p>
              <a href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-amber text-white font-semibold rounded-2xl hover:bg-brand-amber2 transition-all shadow-lg">
                Register Free — शुरू करें
              </a>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
