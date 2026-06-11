import type { Metadata } from 'next'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardTopbar from '@/components/dashboard/Topbar'

export const metadata: Metadata = {
  title: 'My Dashboard — JanSamaadhan',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F6F9] flex">
      {/* Sidebar — hidden on mobile, visible lg+ */}
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <DashboardTopbar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
