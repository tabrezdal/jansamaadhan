import type { Metadata } from 'next'
import CASidebar from '@/components/ca-portal/Sidebar'
import CATopbar from '@/components/ca-portal/Topbar'

export const metadata: Metadata = {
  title: 'CA Portal — JanSamaadhan',
}

export default function CAPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F6F9] flex">
      {/* Sidebar — hidden on mobile, visible lg+ */}
      <CASidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <CATopbar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}