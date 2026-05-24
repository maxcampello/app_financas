import { createClient } from '@/lib/supabase/client'
import type { Transaction, TransactionFilters } from '@/types'

export async function getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
  const supabase = createClient()
  let query = supabase.from('transactions').select('*').order('date', { ascending: false })

  if (filters?.month !== undefined && filters?.year !== undefined) {
    const start = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`
    const lastDay = new Date(filters.year, filters.month, 0).getDate()
    const end = `${filters.year}-${String(filters.month).padStart(2, '0')}-${lastDay}`
    query = query.gte('date', start).lte('date', end)
  }

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createTransaction(
  payload: Omit<Transaction, 'id' | 'user_id' | 'created_at'>
): Promise<Transaction> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...payload, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTransaction(
  id: string,
  payload: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>
): Promise<Transaction> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('transactions')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTransaction(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}
