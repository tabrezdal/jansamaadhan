import Link from 'next/link'
import { Shield, Lock } from 'lucide-react'

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F6F9]">

      {/* Minimal nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-brand-teal flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">J</span>
            </div>
            <span className="font-display font-bold text-brand-teal text-base leading-none">
              Jan<span className="text-brand-amber">Samaadhan</span>
            </span>
          </Link>

          {/* Trust signals */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
              <Lock size={12} className="text-brand-green" />
              <span>Secured checkout</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
              <Shield size={12} className="text-brand-green" />
              <span>CA verified</span>
            </div>
            <Link
              href="/services"
              className="text-xs text-gray-400 hover:text-brand-teal transition-colors"
            >
              Browse all services
            </Link>
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}
