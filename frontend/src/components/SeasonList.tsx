import { useQuery } from '@tanstack/react-query'
import { listSeasons } from '../services/seasonService'
import type { SeasonSummary } from '../types'

const STATUS_LABEL: Record<SeasonSummary['status'], string> = {
  setup: 'Setup',
  active: 'Active',
  completed: 'Completed',
}

const STATUS_BADGE: Record<SeasonSummary['status'], string> = {
  setup: 'badge badge-warning',
  active: 'badge badge-success',
  completed: 'badge badge-neutral',
}

export default function SeasonList({ onNew, onSelect }: { onNew: () => void; onSelect: (s: SeasonSummary) => void }) {
  const { data: seasons, isLoading, error } = useQuery({
    queryKey: ['seasons'],
    queryFn: listSeasons,
  })

  return (
    <div className="p-8 max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold m-0">Seasons</h1>
        <button onClick={onNew} className="btn btn-primary">
          + New Season
        </button>
      </div>

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-error text-sm">{(error as Error).message}</p>}

      {seasons && seasons.length === 0 && (
        <p>No seasons yet. Create one to get started.</p>
      )}

      {seasons && seasons.length > 0 && (
        <ul className="space-y-2">
          {seasons.map((season) => (
            <li key={season.id}>
              <button
                onClick={() => onSelect(season)}
                className="btn btn-outline w-full justify-between"
              >
                <span className="font-medium">{season.name}</span>
                <span className={STATUS_BADGE[season.status]}>
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
