import { useQuery } from '@tanstack/react-query'
import { listSeasons } from '../services/seasonService'
import type { SeasonSummary } from '../types'
import FireIcon from './icons/FireIcon'
import SeasonCard from './SeasonCard'

export default function SeasonList({ onNew, onSelect }: { onNew: () => void; onSelect: (s: SeasonSummary) => void }) {
  const { data: seasons, isLoading, error } = useQuery({
    queryKey: ['seasons'],
    queryFn: listSeasons,
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-medium m-0">Your Seasons</h1>
        <button onClick={onNew} className="btn btn-primary">+ New Season</button>
      </div>

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-error text-sm">{(error as Error).message}</p>}

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

      {seasons && seasons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasons.map((season) => (
            <SeasonCard key={season.id} season={season} onClick={() => onSelect(season)} />
          ))}
          <button
            onClick={onNew}
            className="card items-center justify-center border border-dashed border-base-content/25 text-base-content/35 min-h-48 hover:border-primary hover:text-primary transition-colors w-full"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                <span className="text-2xl leading-none font-light">+</span>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase">New Season</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
