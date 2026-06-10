import type { SeasonSummary } from '../types'
import { formatDate } from '../utils/format'
import TribeBars from './TribeBars'
import StatCell from './ui/StatCell'

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

export default function SeasonCard({ season, onClick }: { season: SeasonSummary; onClick: () => void }) {
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
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold tracking-widest text-base-content/50 uppercase">
            {season.season_number ? `Season ${season.season_number}` : 'Season —'}
          </span>
          <span className={STATUS_BADGE[season.status]}>
            {STATUS_LABEL[season.status]}
          </span>
        </div>

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

        <div className="flex flex-col gap-2 py-1">
          <TribeBars colors={season.tribe_colors} muted={muted} />
          <div className="grid grid-cols-3">
            <StatCell value={muted ? '—' : String(season.player_count)} label="Players" muted={muted} />
            <StatCell value={muted ? '—' : String(season.booted_count)} label="Booted" muted={muted} />
            <StatCell value={currentLabel} label="Current" muted={muted && season.status === 'setup'} />
          </div>
        </div>

        <div className="divider my-0" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-base-content/40">{footerDate}</span>
          <span className="text-sm font-semibold">{ACTION_LABEL[season.status]} →</span>
        </div>
      </div>
    </button>
  )
}
