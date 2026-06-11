import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceCard from '@/components/services/ServiceCard'
import {
  ALL_SERVICES, CATEGORY_META,
  type Category,
} from '@/lib/allServices'

interface Props { params: { category: string } }

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map(cat => ({ category: cat }))
}

export async function generateMetadata({ params }: Props) {
  const meta = CATEGORY_META[params.category as Category]
  if (!meta) return {}
  return {
    title: `${meta.label} Services — JanSamaadhan`,
    description: `${meta.desc} — Expert help at 60-80% less than local agents.`,
  }
}

export default function CategoryPage({ params }: Props) {
  const cat  = params.category as Category
  const meta = CATEGORY_META[cat]
  if (!meta) notFound()

  const services = ALL_SERVICES.filter(s => s.category === cat)
  const phase1   = services.filter(s => s.phase === 1)
  const phase2   = services.filter(s => s.phase === 2)
  const phase3   = services.filter(s => s.phase === 3)
  const popular  = services.filter(s => s.popular)

  // Related categories
  const related = Object.entries(CATEGORY_META)
    .filter(([k]) => k !== cat)
    .slice(0, 4) as [Category, typeof CATEGORY_META[Category]][]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F6F9] pt-16">

        {/* Hero */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-teal transition-colors mb-5 group"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              All services
            </Link>

            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl ${meta.bg} border flex items-center justify-center text-2xl flex-shrink-0`}>
                {meta.emoji}
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-1">{meta.label}</h1>
                <p className="text-gray-500 text-sm mb-3">{meta.desc}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-brand-surface border border-brand-teal/20 text-brand-teal px-3 py-1 rounded-full font-medium">
                    {services.length} services
                  </span>
                  <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full font-medium">
                    {phase1.length} available now
                  </span>
                  {popular.length > 0 && (
                    <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full font-medium">
                      {popular.length} most popular
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

          {/* Phase 1 — available now */}
          {phase1.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <h2 className="font-semibold text-gray-800 text-sm">Available Now</h2>
                <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                  {phase1.length} services
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {phase1.map(s => <ServiceCard key={s.slug} service={s} />)}
              </div>
            </section>
          )}

          {/* Phase 2 — coming soon */}
          {phase2.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <h2 className="font-semibold text-gray-800 text-sm">Coming Soon</h2>
                <span className="text-[10px] bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                  {phase2.length} services
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 opacity-80">
                {phase2.map(s => <ServiceCard key={s.slug} service={s} />)}
              </div>
            </section>
          )}

          {/* Phase 3 — advanced */}
          {phase3.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <h2 className="font-semibold text-gray-800 text-sm">Advanced Services</h2>
                <span className="text-[10px] bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-semibold">
                  {phase3.length} services
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 opacity-70">
                {phase3.map(s => <ServiceCard key={s.slug} service={s} />)}
              </div>
            </section>
          )}

          {/* Related categories */}
          <section>
            <h2 className="font-semibold text-gray-700 text-sm mb-4">Explore other categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map(([key, m]) => (
                <Link
                  key={key}
                  href={`/services/${key}`}
                  className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-brand-teal/40 hover:shadow-sm transition-all group"
                >
                  <div className="text-2xl mb-2">{m.emoji}</div>
                  <div className="text-xs font-semibold text-gray-700 group-hover:text-brand-teal transition-colors">{m.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                    {ALL_SERVICES.filter(s => s.category === key).length} services
                    <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
