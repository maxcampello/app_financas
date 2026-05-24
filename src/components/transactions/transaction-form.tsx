'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { createTransaction, updateTransaction } from '@/lib/transactions'
import {
  CATEGORY_LABELS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  type Transaction,
} from '@/types'

const schema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().min(1, 'Informe o valor').refine((v) => Number(v.replace(',', '.')) > 0, {
    message: 'Valor deve ser maior que zero',
  }),
  description: z.string().min(1, 'Informe a descrição').max(100),
  category: z.string().min(1, 'Selecione a categoria'),
  date: z.string().min(1, 'Informe a data'),
})

type FormData = z.infer<typeof schema>

interface TransactionFormProps {
  transaction?: Transaction
  onSuccess: () => void
  onCancel: () => void
}

export function TransactionForm({ transaction, onSuccess, onCancel }: TransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: transaction?.type ?? 'expense',
      amount: transaction ? String(transaction.amount) : '',
      description: transaction?.description ?? '',
      category: transaction?.category ?? '',
      date: transaction?.date ?? new Date().toISOString().split('T')[0],
    },
  })

  const selectedType = watch('type')
  const categories = selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  async function onSubmit(data: FormData) {
    setError('')
    setLoading(true)
    try {
      const payload = {
        type: data.type,
        amount: Number(data.amount.replace(',', '.')),
        description: data.description,
        category: data.category as Transaction['category'],
        date: data.date,
      }

      if (transaction) {
        await updateTransaction(transaction.id, payload)
      } else {
        await createTransaction(payload)
      }
      onSuccess()
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Tipo</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => { setValue('type', 'income'); setValue('category', '') }}
            className={`py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
              selectedType === 'income'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-green-300'
            }`}
          >
            Receita
          </button>
          <button
            type="button"
            onClick={() => { setValue('type', 'expense'); setValue('category', '') }}
            className={`py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
              selectedType === 'expense'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'
            }`}
          >
            Despesa
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          placeholder="Ex: Almoço, Salário, Uber..."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            placeholder="0,00"
            inputMode="decimal"
            {...register('amount')}
          />
          {errors.amount && (
            <p className="text-xs text-red-500">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input id="date" type="date" {...register('date')} />
          {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select
          defaultValue={transaction?.category}
          onValueChange={(v: unknown) => setValue('category', v as string)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-red-500">{errors.category.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : transaction ? (
            'Atualizar'
          ) : (
            'Adicionar'
          )}
        </Button>
      </div>
    </form>
  )
}
