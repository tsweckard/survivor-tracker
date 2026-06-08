import { useQuery } from '@tanstack/react-query'
import FireIcon from './icons/FireIcon'
import { listSeasons } from '../services/seasonService'
import type { SeasonSummary } from '../types'

const STATUS_LABEL: Record<SeasonSummary['status'], string> = {
  setup: 'In setup',
  active: 'Active',
  completed: 'Complete',
}

const STATUS_BADGE: Record<SeasonSummary['status'], string> = {
  setup: 'badge badge-warning badge-outline',
  active: 'badge badge-success',
  completed: 'badge badge-neutral badge-outline',
}

const ACTION_LABEL: Record<SeasonSummary['status'], string> = {
  setup: 'Resume',
  active: 'Open',
  completed: 'View',
}

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-').map(Number)
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function TribeBars({ colors, muted }: { colors: string[]; muted: boolean }) {
  if (muted || colors.length === 0) {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-base-content/15" />
        ))}
      </div>
    )
  }
  return (
    <div className="flex gap-1">
      {colors.map((color, i) => (
        <div key={i} className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      ))}
    </div>
  )
}

function StatCell({ value, label, muted }: { value: string; label: string; muted: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-lg font-bold leading-none ${muted ? 'text-base-content/30' : ''}`}>
        {value}
      </span>
      <span className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40">
        {label}
      </span>
    </div>
  )
}

function SeasonCard({ season, onClick }: { season: SeasonSummary; onClick: () => void }) {
  const noData = season.player_count === 0 && season.tribe_colors.length === 0
  const muted = noData

  const currentLabel =
    season.status === 'completed' ? 'Done'
    : season.status === 'setup' ? 'Setup'
    : `Ep ${season.episode_count}`

  const footerDate = season.ended_on
    ? `Ended ${formatDate(season.ended_on)}`
    : season.premiered_on
    ? `Started ${formatDate(season.premiered_on)}`
    : null

  return (
    <button
      onClick={onClick}
      className="card border border-base-content/20 bg-base-100 text-left w-full hover:border-primary transition-colors"
    >
      <div className="card-body p-5 gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold tracking-widest text-base-content/50 uppercase">
            {season.season_number ? `Season ${season.season_number}` : 'Season —'}
          </span>
          <span className={STATUS_BADGE[season.status]}>
            {STATUS_LABEL[season.status]}
          </span>
        </div>

        {/* Name + subtitle */}
        <div>
          <h2 className="text-xl font-bold leading-tight">{season.name}</h2>
          {(season.location || season.premiered_on) && (
            <p className="text-sm text-base-content/50 mt-1">
              {[season.location, season.premiered_on ? season.premiered_on.slice(0, 4) : null]
                .filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        <div className="divider my-0" />

        {/* Tribe bars + stats */}
        <div className="flex flex-col gap-2 py-1">
          <TribeBars colors={season.tribe_colors} muted={muted} />
          <div className="grid grid-cols-3">
            <StatCell value={muted ? '—' : String(season.player_count)} label="Players" muted={muted} />
            <StatCell value={muted ? '—' : String(season.booted_count)} label="Booted" muted={muted} />
            <StatCell value={currentLabel} label="Current" muted={muted && season.status === 'setup'} />
          </div>
        </div>

        <div className="divider my-0" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-base-content/40">{footerDate}</span>
          <span className="text-sm font-semibold">{ACTION_LABEL[season.status]} →</span>
        </div>
      </div>
    </button>
  )
}

export default function SeasonList({ onNew, onSelect }: { onNew: () => void; onSelect: (s: SeasonSummary) => void }) {
  const { data: seasons, isLoading, error } = useQuery({
    queryKey: ['seasons'],
    queryFn: listSeasons,
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold m-0">Your Seasons</h1>
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
