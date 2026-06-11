import Link from 'next/link'
import { Clock, ArrowRight, CheckCircle } from 'lucide-react'
import type { ServiceItem } from '@/lib/allServices'
import { CATEGORY_META } from '@/lib/allServices'

const PHASE_BADGE: Record<number, { label: string; color: string }> = {
  1: { label: 'Available now', color: 'bg-green-100 text-green-700'   },
  2: { label: 'Coming soon',   color: 'bg-blue-100 text-blue-700'     },
  3: { label: 'Advanced',      color: 'bg-purple-100 text-purple-700' },
}

export default function ServiceCard({ service }: { service: ServiceItem }) {
  const catMeta  = CATEGORY_META[service.category]
  const phase    = PHASE_BADGE[service.phase]
  const canOrder = service.phase === 1

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-4 hover:border-brand-teal/40 hover:shadow-md transition-all duration-200 flex flex-col">

      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className={`w-10 h-10 rounded-xl ${catMeta.bg} border flex items-center justify-center text-lg flex-shrink-0`}>
          {service.emoji}
        </div>
        <div className="flex flex-col items-end gap-1">
          {service.popular && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-amber text-white">Popular</span>
          )}
          {service.recurring && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">Recurring</span>
          )}
          {!service.popular && !service.recurring && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${phase.color}`}>{phase.label}</span>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="font-semibold text-sm text-gray-800 leading-snug mb-0.5 group-hover:text-brand-teal transition-colors">
        {service.name}
      </h3>
      <p className="text-[11px] text-gray-400 mb-1">{service.nameHindi}</p>

      {/* Desc */}
      <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{service.desc}</p>

      {/* Meta row */}
      <div className="flex items-center gap-3 mb-3 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <Clock size={10} className="text-brand-teal" /> {service.sla}
        </span>
        {service.caRequired && (
          <span className="flex items-center gap-1">
            <CheckCircle size={10} className="text-brand-teal" /> CA verified
          </span>
        )}
      </div>

      {/* Price + CTA */}
      <div className="flex items-end justify-between gap-2 pt-3 border-t border-gray-100">
        <div>
          <div className="font-display font-bold text-lg text-brand-teal leading-none">
            {service.priceLabel}
          </div>
          <div className="text-[10px] text-gray-400 line-through mt-0.5">
            Agent: {service.agentPrice}
          </div>
        </div>

        {canOrder ? (
          <Link
            href={`/order/${service.slug}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-teal text-white text-xs font-semibold rounded-xl hover:bg-brand-teal2 transition-all group-hover:shadow-sm flex-shrink-0"
          >
            Start <ArrowRight size={12} />
          </Link>
        ) : (
          <button
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-500 text-xs font-medium rounded-xl flex-shrink-0 cursor-default"
            disabled
          >
            Notify me
          </button>
        )}
      </div>
    </div>
  )
}
