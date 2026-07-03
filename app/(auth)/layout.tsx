import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'JanSamaadhan — Login / Register' }

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between bg-brand-teal relative overflow-hidden p-8">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />

        <Link href="/" className="relative z-10 flex items-center gap-3 w-fit">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg leading-none">ज</span>
          </div>
          <div>
            <div className="font-display font-bold text-white text-lg leading-none">Jan<span className="text-brand-amber">Samaadhan</span></div>
            <div className="text-[10px] text-white/40 mt-0.5">जन समाधान</div>
          </div>
        </Link>

        <div className="relative z-10">
          <p className="text-white/50 text-xs font-medium mb-2 uppercase tracking-widest">Trusted by 10,000+ Indians</p>
          <h2 className="font-display text-3xl font-bold text-white leading-snug mb-3">
            आपकी सेवा,<br /><span className="text-brand-amber">आपका हक।</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-5">
            Tax filing, PAN, Aadhaar, GST and 90+ government services — all at 70% less than local agents.
          </p>
          <div className="space-y-2">
            {[
              { emoji: '🔒', text: 'Bank-grade AES-256 encryption' },
              { emoji: '✅', text: 'ICAI verified CA experts' },
              { emoji: '⚡', text: 'Services delivered in 48 hours' },
              { emoji: '🇮🇳', text: 'DPDPA 2025 data privacy compliant' },
            ].map(({ emoji, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-sm">{emoji}</span>
                <span className="text-white/70 text-xs">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/25 text-[11px]">© 2026 JanSamaadhan</p>
      </div>

      {/* Right panel — scrollable */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#FAFBFC]">

        {/* Mobile header */}
        <div className="lg:hidden flex items-center px-5 py-3 border-b border-gray-100 bg-white sticky top-0 z-10 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-teal flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm leading-none">ज</span>
            </div>
            <span className="font-display font-bold text-brand-teal text-sm">Jan<span className="text-brand-amber">Samaadhan</span></span>
          </Link>
        </div>

        {/* Form — vertically centered */}
        <div className="flex-1 flex items-center justify-center px-5 py-6">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 text-center flex-shrink-0">
          <p className="text-gray-400 text-xs">
            © 2026 JanSamaadhan &nbsp;·&nbsp;
            <Link href="/privacy" className="hover:text-brand-teal">Privacy</Link> &nbsp;·&nbsp;
            <Link href="/terms" className="hover:text-brand-teal">Terms</Link> &nbsp;·&nbsp;
            <Link href="/contact" className="hover:text-brand-teal">Help</Link>
          </p>
        </div>
      </div>
    </div>
  )
}