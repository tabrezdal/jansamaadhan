'use client'

import { X } from 'lucide-react'
import { CATEGORY_META, ALL_SERVICES, type Category } from '@/lib/allServices'

interface Props {
  activecat:    Category | 'all'
  phase:        0 | 1 | 2 | 3
  caFilter:     boolean | null
  onCategory:   (c: Category | 'all') => void
  onPhase:      (p: 0 | 1 | 2 | 3) => void
  onCaFilter:   (v: boolean | null) => void
  onClose:      () => void
  onClearAll:   () => void
}

export default function FilterDrawer({
  activecat, phase, caFilter,
  onCategory, onPhase, onCaFilter,
  onClose, onClearAll,
}: Props) {
  const CATEGORIES = Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer — slides up from bottom */}
      <div className="relative mt-auto w-full bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-gray-800 text-sm">Filter Services</h3>
          <div className="flex items-center gap-3">
            <button onClick={onClearAll} className="text-xs text-brand-teal font-semibold hover:underline">
              Clear all
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-6">

          {/* Category */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Category</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onCategory('all')}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left
                  ${activecat === 'all'
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-white text-gray-600 border-gray-200'}`}
              >
                All Services ({ALL_SERVICES.length})
              </button>
              {CATEGORIES.map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => onCategory(key)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-2
                    ${activecat === key
                      ? 'bg-brand-teal text-white border-brand-teal'
                      : 'bg-white text-gray-600 border-gray-200'}`}
                >
                  <span>{meta.emoji}</span>
                  <span className="truncate">{meta.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phase */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Availability</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { v: 0 as const, label: 'All phases' },
                { v: 1 as const, label: 'Available now' },
                { v: 2 as const, label: 'Coming soon' },
                { v: 3 as const, label: 'Advanced' },
              ]).map(opt => (
                <button
                  key={opt.v}
                  onClick={() => onPhase(opt.v)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left
                    ${phase === opt.v
                      ? 'bg-brand-teal text-white border-brand-teal'
                      : 'bg-white text-gray-600 border-gray-200'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* CA required */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Expert needed</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { v: null,  label: 'Any' },
                { v: false, label: 'No CA' },
                { v: true,  label: 'CA required' },
              ]).map(opt => (
                <button
                  key={String(opt.v)}
                  onClick={() => onCaFilter(opt.v)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-center
                    ${caFilter === opt.v
                      ? 'bg-brand-teal text-white border-brand-teal'
                      : 'bg-white text-gray-600 border-gray-200'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Apply */}
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-brand-teal text-white font-semibold text-sm rounded-xl hover:bg-brand-teal2 transition-all shadow-sm"
          >
            Show Results
          </button>

          {/* Bottom safe area */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  )
}
