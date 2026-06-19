import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export interface LegalSection {
  id:    string
  title: string
}

interface Props {
  title:       string
  effective:   string
  sections:    LegalSection[]
  children:    React.ReactNode
}

export default function LegalPageLayout({ title, effective, sections, children }: Props) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFBFC] pt-16">

        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-ink mb-2">{title}</h1>
            <p className="text-sm text-gray-400">Last updated: {effective}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex gap-10">

            {/* Sticky TOC — desktop only */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">On this page</p>
                <nav className="space-y-1">
                  {sections.map(s => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block text-sm text-gray-500 hover:text-brand-teal py-1.5 border-l-2 border-transparent hover:border-brand-teal pl-3 transition-colors"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Document body */}
            <article className="flex-1 min-w-0 legal-doc">
              {children}
            </article>
          </div>

          {/* Bottom nav to other legal docs */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-3">
            <span className="text-xs text-gray-400 mr-2">Related policies:</span>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Refund Policy', href: '/refund-policy' },
              { label: 'Disclaimer', href: '/disclaimer' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-xs text-brand-teal hover:underline">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
