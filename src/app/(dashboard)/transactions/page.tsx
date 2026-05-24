'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TransactionList } from '@/components/transactions/transaction-list'
import { TransactionFiltersBar } from '@/components/transactions/transaction-filters'
import { TransactionDialog } from '@/components/transactions/transaction-dialog'
import { getTransactions } from '@/lib/transactions'
import type { Transaction, TransactionFilters } from '@/types'

export default function TransactionsPage() {
  const now = new Date()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TransactionFilters>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    type: 'all',
    category: 'all',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTransactions(filters)
      setTransactions(data)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transações</h1>
          <p className="text-sm text-slate-500">
            {loading ? '...' : `${transactions.length} transação(ões) encontrada(s)`}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <TransactionFiltersBar filters={filters} onChange={setFilters} />

      <Card className="border-0 shadow-sm">
        <CardContent className="pt-2 pb-4 px-6">
          {loading ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <TransactionList transactions={transactions} onRefresh={load} />
          )}
        </CardContent>
      </Card>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={load}
      />
    </div>
  )
}
