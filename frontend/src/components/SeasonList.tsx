import { useQuery } from '@tanstack/react-query'
import { listSeasons } from '../services/seasonService'
import type { SeasonSummary } from '../types'

const STATUS_LABEL: Record<SeasonSummary['status'], string> = {
  setup: 'Setup',
  active: 'Active',
  completed: 'Completed',
}

const STATUS_COLOR: Record<SeasonSummary['status'], string> = {
  setup: 'text-yellow-600',
  active: 'text-green-600',
  completed: 'text-[var(--text)]',
}

export default function SeasonList({ onNew, onSelect }: { onNew: () => void; onSelect: (s: SeasonSummary) => void }) {
  const { data: seasons, isLoading, error } = useQuery({
    queryKey: ['seasons'],
    queryFn: listSeasons,
  })

  return (
    <div className="p-8 max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="!mb-0">Seasons</h1>
        <button
          onClick={onNew}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded"
        >
          + New Season
        </button>
      </div>

      {isLoading && <p className="text-[var(--text)]">Loading…</p>}
      {error && <p className="text-red-500 text-sm">{(error as Error).message}</p>}

      {seasons && seasons.length === 0 && (
        <p className="text-[var(--text)]">No seasons yet. Create one to get started.</p>
      )}

      {seasons && seasons.length > 0 && (
        <ul className="space-y-2">
          {seasons.map((season) => (
            <li key={season.id}>
              <button
                onClick={() => onSelect(season)}
                className="w-full text-left flex items-center justify-between px-4 py-3 border border-[var(--border)] rounded hover:border-[var(--accent)] transition-colors"
              >
                <span className="font-medium text-[var(--text-h)]">{season.name}</span>
                <span className={`text-sm ${STATUS_COLOR[season.status]}`}>
                  {STATUS_LABEL[season.status]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
