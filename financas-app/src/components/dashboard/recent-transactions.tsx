import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CATEGORY_LABELS } from '@/types'
import type { Transaction } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 5)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Últimas Transações</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">Nenhuma transação registrada</p>
        ) : (
          <div className="space-y-3">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    t.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{t.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {format(new Date(t.date + 'T12:00:00'), 'dd MMM', { locale: ptBR })}
                      </span>
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {CATEGORY_LABELS[t.category]}
                      </Badge>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-semibold flex-shrink-0 ml-4 ${
                  t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
