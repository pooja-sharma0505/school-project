export function formatCurrency(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n || 0)
} 

export function formatCurrencyExact(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n || 0)
}

export function formatDate(d: string | null | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!d) return '—'
  return new Date(d + 'T00:00').toLocaleDateString('en-US', options ?? { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateLong(d: string) {
  return new Date(d + 'T00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function initials(first?: string | null, last?: string | null) {
  return `${first?.[0] || ''}${last?.[0] || ''}`
}

export function studentInitials(s: { first_name?: string | null; last_name?: string | null }) {
  return initials(s.first_name, s.last_name)
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}
