export const dynamic = 'force-dynamic'

import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <main className="flex-1 p-6 pb-24 md:pb-6">{children}</main>
      <MobileNav />
    </div>
  )
}
