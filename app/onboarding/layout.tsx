import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'JanSamaadhan — Quick Setup' }

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[44%] flex-col justify-between bg-gradient-to-br from-brand-teal to-brand-teal3 p-10 xl:p-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-brand-amber/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
            <span className="text-white font-display font-bold text-xl leading-none">ज</span>
          </div>
          <div>
            <div className="font-display font-bold text-white text-xl leading-none">Jan<span className="text-brand-amber">Samaadhan</span></div>
            <div className="text-[11px] text-white/40 mt-0.5">जन समाधान</div>
          </div>
        </Link>

        <div className="relative z-10">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Almost there</p>
          <h2 className="font-display text-3xl font-bold text-white mb-4 leading-snug">
            30 seconds to<br />
            <span className="text-brand-amber">your dashboard.</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Tell us a little about yourself so we can show you the most relevant services — and connect you with the right CA expert.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { num: '95+', label: 'Services available to you' },
              { num: '₹0',  label: 'To register — free forever' },
              { num: '48h', label: 'Max delivery for any service' },
            ].map(({ num, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-white text-sm">{num}</span>
                </div>
                <span className="text-white/60 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/25 text-xs">© 2026 JanSamaadhan</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#FAFBFC]">
        <div className="lg:hidden flex items-center px-5 py-4 border-b border-gray-100 bg-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center">
              <span className="text-white font-display font-bold text-base leading-none">ज</span>
            </div>
            <span className="font-display font-bold text-brand-teal">Jan<span className="text-brand-amber">Samaadhan</span></span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  )
}
