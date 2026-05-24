'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MonthSelector } from '@/components/dashboard/month-selector'
import { CATEGORY_LABELS, type Category, type TransactionFilters } from '@/types'

interface TransactionFiltersProps {
  filters: TransactionFilters
  onChange: (filters: TransactionFilters) => void
}

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]

export function TransactionFiltersBar({ filters, onChange }: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <MonthSelector
        month={filters.month!}
        year={filters.year!}
        onChange={(month, year) => onChange({ ...filters, month, year })}
      />

      <Select
        value={filters.type ?? 'all'}
        onValueChange={(v: unknown) => onChange({ ...filters, type: v as TransactionFilters['type'] })}
      >
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="income">Receitas</SelectItem>
          <SelectItem value="expense">Despesas</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.category ?? 'all'}
        onValueChange={(v: unknown) =>
          onChange({ ...filters, category: v as TransactionFilters['category'] })
        }
      >
        <SelectTrigger className="w-44 h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {ALL_CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
