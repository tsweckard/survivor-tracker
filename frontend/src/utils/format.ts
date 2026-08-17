export function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-').map(Number)
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
