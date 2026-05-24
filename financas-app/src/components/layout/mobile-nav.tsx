'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ArrowLeftRight, LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href} className="flex-1">
            <span
              className={cn(
                'flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                isActive ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </span>
          </Link>
        )
      })}
      <div className="flex-1 flex flex-col items-center justify-center py-3">
        <ThemeToggle />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Tema</span>
      </div>
      <button
        onClick={handleLogout}
        className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium text-slate-500 dark:text-slate-400"
      >
        <LogOut className="h-5 w-5" />
        Sair
      </button>
    </nav>
  )
}
