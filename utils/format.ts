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

function padDatePart(value: number) {
  return String(value).padStart(2, '0')
}

export function formatLocalISODate(date: Date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`
}

export function normalizeDateOnly(value: string | Date | null | undefined) {
  if (!value) return ''

  if (typeof value === 'string') {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/)

    if (match) {
      return match[1]
    }
  }

  const parsed = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return formatLocalISODate(parsed)
}

export function todayISO() {
  return formatLocalISODate(new Date())
}

export function shiftISODate(dateString: string, days: number) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  date.setDate(date.getDate() + days)

  return formatLocalISODate(date)
}
