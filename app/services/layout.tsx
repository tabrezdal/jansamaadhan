import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Services — JanSamaadhan',
  description:
    '95+ financial and government services — ITR filing, PAN, Aadhaar, GST, legal documents and more. Expert CAs, transparent pricing, 48-hour delivery.',
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
