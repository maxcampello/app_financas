'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  // resolvedTheme é undefined antes da hidratação. Renderiza placeholder com mesmas
  // dimensões para evitar layout shift, sem precisar de useEffect + setState.
  if (!resolvedTheme) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        aria-hidden
        className="h-8 w-8 text-slate-500 dark:text-slate-400"
      >
        <Moon className="h-4 w-4 opacity-0" />
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
