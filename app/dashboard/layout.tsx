import Topbar from '@/components/dashboard/Topbar'
import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">

      {/* Sidebar — fixed height, never scrolls with page */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 h-screen sticky top-0 border-r border-gray-100 bg-white">
        <Sidebar />
      </aside>

      {/* Main content — scrolls independently */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {children}
        </main>
      </div>

    </div>
  )
}