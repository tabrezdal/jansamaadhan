import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Briefcase, Heart, Zap, Globe, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Careers — JanSamaadhan',
  description: 'Join JanSamaadhan and help build India\'s most affordable platform for tax filing, identity services, and government compliance.',
}

const PERKS = [
  { icon: Zap,     title: 'Real impact', desc: 'Every feature you ship helps real people in real cities save real money on real compliance headaches.' },
  { icon: Heart,   title: 'Customer-first culture', desc: 'We measure success by customer outcomes, not vanity metrics.' },
  { icon: Globe,   title: 'Remote-friendly', desc: 'Work from anywhere in India — we care about output, not office hours.' },
  { icon: Briefcase, title: 'Ownership', desc: 'Small team, high autonomy. You will own things end-to-end, not just a corner of a Jira board.' },
]

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFBFC] pt-16">

        {/* Hero */}
        <div className="bg-brand-teal py-14 sm:py-18 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Help Us Build India's Compliance Layer
            </h1>
            <p className="text-white/70 text-base max-w-xl mx-auto">
              We're a small team solving a big, unglamorous problem: making tax and government services work for
              everyone, not just those who know an agent.
            </p>
          </div>
        </div>

        {/* Why join */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="font-display text-2xl font-bold text-brand-ink mb-8 text-center">Why JanSamaadhan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PERKS.map(p => {
              const Icon = p.icon
              return (
                <div key={p.title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-white">
                  <div className="w-11 h-11 rounded-xl bg-brand-surface flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-ink text-sm mb-1">{p.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Open roles — placeholder, no live listings yet */}
        <div className="bg-white border-y border-gray-100 py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Briefcase size={28} className="text-brand-teal mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-brand-ink mb-3">No open roles right now</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
              We don't have specific openings listed at the moment, but we're always happy to hear from people who
              care about fixing how India accesses tax and government services — especially engineers, ICAI-qualified
              CAs interested in platform/ops roles, and customer support folks fluent in regional languages.
            </p>
            <a
              href="mailto:careers@jansamaadhan.in"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white text-sm font-semibold rounded-2xl hover:bg-brand-teal2 transition-all shadow-sm"
            >
              <Mail size={15} /> Email us your profile
            </a>
            <p className="text-xs text-gray-400 mt-4">careers@jansamaadhan.in — we read every message, even without an open role.</p>
          </div>
        </div>

        {/* CA partner alt path */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-gray-500 text-sm mb-3">Looking to work with us as a Chartered Accountant instead of joining the core team?</p>
          <a href="/ca-register" className="text-sm font-semibold text-brand-teal hover:underline">
            Join as a CA Partner →
          </a>
        </div>

      </main>
      <Footer />
    </>
  )
}
