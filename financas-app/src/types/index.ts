export type TransactionType = 'income' | 'expense'

export type Category =
  | 'alimentacao'
  | 'transporte'
  | 'moradia'
  | 'saude'
  | 'educacao'
  | 'lazer'
  | 'salario'
  | 'freelance'
  | 'investimentos'
  | 'outros'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  description: string
  category: Category
  date: string
  created_at: string
}

export interface TransactionFilters {
  month?: number
  year?: number
  category?: Category | 'all'
  type?: TransactionType | 'all'
}

export interface DashboardSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
}

export interface CategoryTotal {
  category: Category
  total: number
}

export const CATEGORY_LABELS: Record<Category, string> = {
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  moradia: 'Moradia',
  saude: 'Saúde',
  educacao: 'Educação',
  lazer: 'Lazer',
  salario: 'Salário',
  freelance: 'Freelance',
  investimentos: 'Investimentos',
  outros: 'Outros',
}

export const CATEGORY_COLORS: Record<Category, string> = {
  alimentacao: '#f97316',
  transporte: '#3b82f6',
  moradia: '#8b5cf6',
  saude: '#ef4444',
  educacao: '#06b6d4',
  lazer: '#f59e0b',
  salario: '#22c55e',
  freelance: '#10b981',
  investimentos: '#6366f1',
  outros: '#6b7280',
}

export const INCOME_CATEGORIES: Category[] = ['salario', 'freelance', 'investimentos', 'outros']
export const EXPENSE_CATEGORIES: Category[] = [
  'alimentacao',
  'transporte',
  'moradia',
  'saude',
  'educacao',
  'lazer',
  'outros',
]
