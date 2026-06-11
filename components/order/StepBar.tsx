import { Check } from 'lucide-react'

interface Step { num: number; label: string }

export default function StepBar({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-0 w-full max-w-lg">
        {steps.map((step, i) => {
          const done    = current > step.num
          const active  = current === step.num
          const isLast  = i === steps.length - 1

          return (
            <div key={step.num} className="flex items-center flex-1">
              {/* Step node */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-bold
                  ${done   ? 'bg-brand-green border-brand-green text-white'
                  : active ? 'bg-brand-teal border-brand-teal text-white shadow-md shadow-brand-teal/30'
                  :          'bg-white border-gray-200 text-gray-400'}`}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : step.num}
                </div>
                <span className={`text-[10px] font-medium whitespace-nowrap hidden sm:block transition-colors
                  ${done   ? 'text-brand-green'
                  : active ? 'text-brand-teal'
                  :          'text-gray-400'}`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2 mt-[-18px] sm:mt-[-22px]">
                  <div className={`h-0.5 rounded-full transition-all duration-500 ${done ? 'bg-brand-green' : 'bg-gray-200'}`} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
