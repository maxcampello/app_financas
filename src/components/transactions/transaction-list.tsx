'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TransactionDialog } from './transaction-dialog'
import { deleteTransaction } from '@/lib/transactions'
import { CATEGORY_LABELS, type Transaction } from '@/types'

interface TransactionListProps {
  transactions: Transaction[]
  onRefresh: () => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function TransactionList({ transactions, onRefresh }: TransactionListProps) {
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState<Transaction | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleDelete() {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await deleteTransaction(deleting.id)
      onRefresh()
    } finally {
      setDeleteLoading(false)
      setDeleting(null)
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-sm">Nenhuma transação encontrada</p>
        <p className="text-xs mt-1">Use o botão acima para adicionar uma transação</p>
      </div>
    )
  }

  return (
    <>
      <div className="divide-y divide-slate-100">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  t.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{t.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">
                    {format(new Date(t.date + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {CATEGORY_LABELS[t.category]}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span
                className={`text-sm font-semibold ${
                  t.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-blue-600"
                  onClick={() => setEditing(t)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-red-600"
                  onClick={() => setDeleting(t)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TransactionDialog
        open={!!editing}
        onOpenChange={(open: boolean) => !open && setEditing(null)}
        transaction={editing ?? undefined}
        onSuccess={onRefresh}
      />

      <Dialog open={!!deleting} onOpenChange={(open: boolean) => !open && setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir transação?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. A transação{' '}
              <strong>&quot;{deleting?.description}&quot;</strong> será removida permanentemente.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleting(null)}
              disabled={deleteLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
