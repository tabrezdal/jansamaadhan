'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, X, Zap, ArrowRight } from 'lucide-react'
import {
  ALL_SERVICES, CATEGORY_META, searchServices,
  type Category, type ServiceItem
} from '@/lib/allServices'
import ServiceCard from '@/components/services/ServiceCard'
import FilterDrawer from '@/components/services/FilterDrawer'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const CATEGORIES = Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]

const SORT_OPTIONS = [
  { id: 'popular',  label: 'Most Popular' },
  { id: 'price-lo', label: 'Price: Low to High' },
  { id: 'price-hi', label: 'Price: High to Low' },
  { id: 'phase',    label: 'Available Now First' },
]

type SortId = 'popular' | 'price-lo' | 'price-hi' | 'phase'

export default function ServicesPage() {
  const [query,      setQuery]      = useState('')
  const [activecat,  setActivecat]  = useState<Category | 'all'>('all')
  const [sort,       setSort]       = useState<SortId>('popular')
  const [phase,      setPhase]      = useState<1 | 2 | 3 | 0>(0)
  const [caFilter,   setCaFilter]   = useState<boolean | null>(null)
  const [showFilter, setShowFilter] = useState(false)

  const results = useMemo(() => {
    let list: ServiceItem[] = query ? searchServices(query) : [...ALL_SERVICES]

    if (activecat !== 'all') list = list.filter(s => s.category === activecat)
    if (phase)               list = list.filter(s => s.phase === phase)
    if (caFilter !== null)   list = list.filter(s => s.caRequired === caFilter)

    switch (sort) {
      case 'popular':  list = [...list].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)); break
      case 'price-lo': list = [...list].sort((a, b) => a.price - b.price); break
      case 'price-hi': list = [...list].sort((a, b) => b.price - a.price); break
      case 'phase':    list = [...list].sort((a, b) => a.phase - b.phase); break
    }

    return list
  }, [query, activecat, sort, phase, caFilter])

  const activeFilters = [
    phase     ? `Phase ${phase}`                : null,
    caFilter === true  ? 'CA required'          : null,
    caFilter === false ? 'No CA needed'         : null,
  ].filter(Boolean)

  function clearAll() {
    setQuery(''); setActivecat('all'); setSort('popular')
    setPhase(0); setCaFilter(null)
  }

  // Group results by category for display when no category filter
  const grouped = useMemo(() => {
    if (activecat !== 'all' || query) return null
    const map: Partial<Record<Category, ServiceItem[]>> = {}
    results.forEach(s => {
      if (!map[s.category]) map[s.category] = []
      map[s.category]!.push(s)
    })
    return map
  }, [results, activecat, query])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F6F9] pt-16">

        {/* ── Hero strip ── */}
        <div className="bg-brand-teal py-10 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">95+ services</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
              Every Service You Need —{' '}
              <span className="text-brand-amber">One Platform</span>
            </h1>
            <p className="text-white/70 text-sm max-w-xl mx-auto mb-6">
              Tax filing, PAN, Aadhaar, GST, legal documents, govt certificates — all at 60–80% less than local agents.
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search — ITR, PAN, GST, Aadhaar, passport…"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-0 bg-white text-sm text-gray-800 outline-none shadow-lg placeholder-gray-400"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* ── Stats strip ── */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
            {[
              { num: '95+', label: 'Services' },
              { num: '₹49', label: 'Starts at' },
              { num: '48h', label: 'Max SLA' },
              { num: '4.8★', label: 'Rating' },
              { num: '0', label: 'Hidden fees' },
              { num: '10K+', label: 'Customers' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <div className="font-display font-bold text-base text-brand-teal">{s.num}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-6">

            {/* ── Sidebar filters (desktop) ── */}
            <aside className="hidden lg:block w-52 flex-shrink-0 space-y-5">

              {/* Category */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</p>
                <ul className="space-y-0.5">
                  <li>
                    <button
                      onClick={() => setActivecat('all')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all
                        ${activecat === 'all' ? 'bg-brand-teal text-white' : 'text-gray-600 hover:bg-white hover:text-brand-teal'}`}
                    >
                      <span>All Services</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                        ${activecat === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {ALL_SERVICES.length}
                      </span>
                    </button>
                  </li>
                  {CATEGORIES.map(([key, meta]) => {
                    const count = ALL_SERVICES.filter(s => s.category === key).length
                    return (
                      <li key={key}>
                        <button
                          onClick={() => setActivecat(key)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all
                            ${activecat === key ? 'bg-brand-teal text-white' : 'text-gray-600 hover:bg-white hover:text-brand-teal'}`}
                        >
                          <span className="text-sm">{meta.emoji}</span>
                          <span className="flex-1 text-left">{meta.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                            ${activecat === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            {count}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Phase */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Availability</p>
                <ul className="space-y-0.5">
                  {([0,1,2,3] as const).map(p => (
                    <li key={p}>
                      <button
                        onClick={() => setPhase(p)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-medium text-left transition-all
                          ${phase === p ? 'bg-brand-teal text-white' : 'text-gray-600 hover:bg-white hover:text-brand-teal'}`}
                      >
                        {p === 0 ? 'All phases' : `Phase ${p} ${p === 1 ? '(Live now)' : p === 2 ? '(Coming soon)' : '(Advanced)'}`}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CA required */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Expert needed</p>
                <ul className="space-y-0.5">
                  {[
                    { v: null,  label: 'Any' },
                    { v: false, label: 'No CA needed' },
                    { v: true,  label: 'CA required' },
                  ].map(opt => (
                    <li key={String(opt.v)}>
                      <button
                        onClick={() => setCaFilter(opt.v)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-medium text-left transition-all
                          ${caFilter === opt.v ? 'bg-brand-teal text-white' : 'text-gray-600 hover:bg-white hover:text-brand-teal'}`}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {activeFilters.length > 0 && (
                <button onClick={clearAll} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                  <X size={11} /> Clear all filters
                </button>
              )}
            </aside>

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0">

              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-700">
                    {query ? `"${query}"` : activecat === 'all' ? 'All Services' : CATEGORY_META[activecat as Category]?.label}
                  </p>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    {results.length} services
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:border-brand-teal"
                  >
                    <SlidersHorizontal size={13} /> Filters
                    {activeFilters.length > 0 && (
                      <span className="ml-1 w-4 h-4 rounded-full bg-brand-teal text-white text-[9px] font-bold flex items-center justify-center">
                        {activeFilters.length}
                      </span>
                    )}
                  </button>

                  {/* Mobile filter drawer */}
                  {showFilter && (
                    <FilterDrawer
                      activecat={activecat}
                      phase={phase}
                      caFilter={caFilter}
                      onCategory={c => { setActivecat(c); }}
                      onPhase={p => { setPhase(p); }}
                      onCaFilter={v => { setCaFilter(v); }}
                      onClose={() => setShowFilter(false)}
                      onClearAll={() => { clearAll(); setShowFilter(false); }}
                    />
                  )}
                  {/* Sort */}
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value as SortId)}
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 outline-none focus:border-brand-teal cursor-pointer"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Active filter chips */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeFilters.map(f => (
                    <span key={f} className="inline-flex items-center gap-1.5 text-xs bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-3 py-1 rounded-full font-medium">
                      {f}
                    </span>
                  ))}
                  <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                    <X size={11} /> Clear all
                  </button>
                </div>
              )}

              {/* No results */}
              {results.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="font-semibold text-gray-700 mb-1">No services found for "{query}"</p>
                  <p className="text-sm text-gray-400 mb-4">Try different keywords like "ITR", "PAN", "GST", or "passport"</p>
                  <button onClick={clearAll} className="text-sm text-brand-teal font-semibold hover:underline">Clear search</button>
                </div>
              )}

              {/* Search results — flat grid */}
              {(query || activecat !== 'all') && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {results.map(s => <ServiceCard key={s.slug} service={s} />)}
                </div>
              )}

              {/* Grouped by category when no filter */}
              {!query && activecat === 'all' && grouped && (
                <div className="space-y-10">
                  {CATEGORIES.map(([key, meta]) => {
                    const items = grouped[key]
                    if (!items?.length) return null
                    return (
                      <div key={key}>
                        {/* Category header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-xl ${meta.bg} border flex items-center justify-center text-lg`}>
                              {meta.emoji}
                            </div>
                            <div>
                              <h2 className="font-semibold text-gray-800 text-sm">{meta.label}</h2>
                              <p className="text-[11px] text-gray-400">{meta.desc}</p>
                            </div>
                          </div>
                          <Link
                            href={`/services/${key}`}
                            className="text-xs text-brand-teal font-semibold hover:underline flex items-center gap-1 flex-shrink-0"
                          >
                            View all {ALL_SERVICES.filter(s => s.category === key).length}
                            <ArrowRight size={12} />
                          </Link>
                        </div>

                        {/* Up to 6 cards per category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                          {items.slice(0, 6).map(s => <ServiceCard key={s.slug} service={s} />)}
                        </div>

                        {/* "See more" if more than 6 */}
                        {items.length > 6 && (
                          <div className="mt-3 text-center">
                            <Link
                              href={`/services/${key}`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal hover:underline"
                            >
                              +{items.length - 6} more {meta.label} services <ArrowRight size={11} />
                            </Link>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-teal2 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
            <div className="relative z-10">
              <Zap size={20} className="text-brand-amber mx-auto mb-3" />
              <h3 className="font-display font-bold text-xl text-white mb-2">Don't see what you need?</h3>
              <p className="text-white/70 text-sm mb-5">Tell us — we add new services every month based on user requests.</p>
              <a href="https://wa.me/919664850011"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-amber text-white font-semibold text-sm rounded-xl hover:bg-brand-amber2 transition-all shadow-md">
                💬 Request a service on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
