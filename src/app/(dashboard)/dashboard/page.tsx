'use client'

import { useState, useEffect, useCallback } from 'react'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { ExpenseChart } from '@/components/dashboard/expense-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { MonthSelector } from '@/components/dashboard/month-selector'
import { getTransactions } from '@/lib/transactions'
import type { Transaction, DashboardSummary, CategoryTotal } from '@/types'

function computeSummary(transactions: Transaction[]): DashboardSummary {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses }
}

function computeCategoryTotals(transactions: Transaction[]): CategoryTotal[] {
  const map = new Map<string, number>()
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount))
    })
  return Array.from(map.entries())
    .map(([category, total]) => ({ category: category as CategoryTotal['category'], total }))
    .sort((a, b) => b.total - a.total)
}

export default function DashboardPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTransactions({ month, year })
      setTransactions(data)
    } finally {
      setLoading(false)
    }
  }, [month, year])

  useEffect(() => {
    load()
  }, [load])

  const summary = computeSummary(transactions)
  const categoryTotals = computeCategoryTotals(transactions)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Visão geral das suas finanças</p>
        </div>
        <MonthSelector
          month={month}
          year={year}
          onChange={(m, y) => {
            setMonth(m)
            setYear(y)
          }}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <SummaryCards summary={summary} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <div className="h-80 bg-white rounded-xl animate-pulse" />
            <div className="h-80 bg-white rounded-xl animate-pulse" />
          </>
        ) : (
          <>
            <ExpenseChart data={categoryTotals} />
            <RecentTransactions transactions={transactions} />
          </>
        )}
      </div>
    </div>
  )
}
