import { useQuery } from '@tanstack/react-query'
import FireIcon from './icons/FireIcon'
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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className='flex flex-col'>
          <h1 className="text-2xl font-bold m-0">Your Seasons</h1>
        </div>
        <button onClick={onNew} className="btn btn-primary">
          + New Season
        </button>
      </div>

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-error text-sm">{(error as Error).message}</p>}

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

      {seasons && seasons.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-base-content/25 flex items-center justify-center">
            <FireIcon size={24} className="opacity-25" />
          </div>
          <div>
            <p className="font-semibold text-base-content">No seasons tracked yet</p>
            <p className="text-sm text-base-content/50 mt-1 max-w-xs">
              Start by creating your first season. Add tribes, players, and track every vote.
            </p>
          </div>
          <button onClick={onNew} className="btn btn-primary mt-2">
            + Create your first season
          </button>
        </div>
      )}
    </div>
  )
}
