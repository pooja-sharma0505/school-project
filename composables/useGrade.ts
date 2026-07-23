export function useGrade() {
  const computeGrade = (marks: number, maxMarks: number): string => {
    const pct = (marks / maxMarks) * 100
    if (pct >= 90) return 'A+'
    if (pct >= 80) return 'A'
    if (pct >= 70) return 'B+'
    if (pct >= 60) return 'B'
    if (pct >= 50) return 'C'
    if (pct >= 40) return 'D'
    if (pct >= 33) return 'E'
    return 'F'
  }

  const gradeColor = (grade: string): string => {
    const map: Record<string, string> = {
      'A+': 'bg-emerald-50 text-emerald-700',
      'A': 'bg-emerald-50 text-emerald-700',
      'B+': 'bg-blue-50 text-blue-700',
      'B': 'bg-blue-50 text-blue-700',
      'C': 'bg-amber-50 text-amber-700',
      'D': 'bg-amber-50 text-amber-700',
      'E': 'bg-orange-50 text-orange-700',
      'F': 'bg-red-50 text-red-700',
    }
    return map[grade] || 'bg-slate-100 text-slate-600'
  }

  return { computeGrade, gradeColor }
}
