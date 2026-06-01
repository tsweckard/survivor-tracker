import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSeason, createPlayer, deletePlayer, activateSeason } from '../../services/seasonService'
import BackButton from './BackButton'

type StatKey = 'athleticism' | 'social' | 'strategic' | 'likability' | 'loyalty'
type Stats = Record<StatKey, number>

const STAT_FIELDS: { key: StatKey; label: string }[] = [
  { key: 'athleticism', label: 'Athleticism' },
  { key: 'social', label: 'Social' },
  { key: 'strategic', label: 'Strategic' },
  { key: 'likability', label: 'Likability' },
  { key: 'loyalty', label: 'Loyalty' },
]

const defaultStats: Stats = { athleticism: 5, social: 5, strategic: 5, likability: 5, loyalty: 5 }

export default function PlayersStep({ seasonId, onActivated, onBack }: { seasonId: number; onActivated: () => void; onBack?: () => void }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [tribeId, setTribeId] = useState<string>('')
  const [stats, setStats] = useState<Stats>({ ...defaultStats })

  const { data: season } = useQuery({
    queryKey: ['season', seasonId],
    queryFn: () => getSeason(seasonId),
  })

  const createMutation = useMutation({
    mutationFn: () =>
      createPlayer(seasonId, {
        name,
        tribe_id: tribeId ? parseInt(tribeId) : null,
        ...stats,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['season', seasonId] })
      setName('')
      setTribeId('')
      setStats({ ...defaultStats })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (playerId: number) => deletePlayer(seasonId, playerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['season', seasonId] }),
  })

  const activateMutation = useMutation({
    mutationFn: () => activateSeason(seasonId),
    onSuccess: (data) => {
      if (data.status === 'active') onActivated()
    },
  })

  const tribeMap = Object.fromEntries((season?.tribes ?? []).map((t) => [t.id, t]))

  return (
    <div className="p-8 max-w-2xl">
      {onBack && <BackButton onClick={onBack} />}
      <h1>Add Players</h1>

      <ul className="space-y-2 mb-6">
        {season?.players.map((player) => (
          <li key={player.id} className="flex items-center gap-3">
            <span className="flex-1">
              {player.name}
              {player.tribe_id && tribeMap[player.tribe_id] && (
                <span className="ml-2 text-sm" style={{ color: tribeMap[player.tribe_id].color }}>
                  ({tribeMap[player.tribe_id].name})
                </span>
              )}
            </span>
            <button
              onClick={() => deleteMutation.mutate(player.id)}
              disabled={deleteMutation.isPending}
              className="text-red-500 text-sm disabled:opacity-50"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate() }} className="space-y-4 mb-8">
        <div>
          <label htmlFor="player-name" className="block text-sm font-medium mb-1">Name</label>
          <input
            id="player-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-[var(--border)] rounded px-3 py-2 bg-[var(--bg)]"
          />
        </div>

        <div>
          <label htmlFor="player-tribe" className="block text-sm font-medium mb-1">Tribe (optional)</label>
          <select
            id="player-tribe"
            value={tribeId}
            onChange={(e) => setTribeId(e.target.value)}
            className="w-full border border-[var(--border)] rounded px-3 py-2 bg-[var(--bg)]"
          >
            <option value="">— unassigned —</option>
            {season?.tribes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {STAT_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label htmlFor={`stat-${key}`} className="block text-sm font-medium mb-1">
                {label}: {stats[key]}
              </label>
              <input
                id={`stat-${key}`}
                type="range"
                min={1}
                max={10}
                value={stats[key]}
                onChange={(e) => setStats((s) => ({ ...s, [key]: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {createMutation.error && <p className="text-red-500 text-sm">{(createMutation.error as Error).message}</p>}
        {deleteMutation.error && <p className="text-red-500 text-sm">{(deleteMutation.error as Error).message}</p>}

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded disabled:opacity-50"
        >
          {createMutation.isPending ? 'Adding…' : 'Add Player'}
        </button>
      </form>

      {activateMutation.error && <p className="text-red-500 text-sm mb-2">{(activateMutation.error as Error).message}</p>}
      <button
        onClick={() => activateMutation.mutate()}
        disabled={activateMutation.isPending}
        className="px-4 py-2 bg-green-600 text-white rounded font-semibold disabled:opacity-50"
      >
        {activateMutation.isPending ? 'Activating…' : 'Activate Season'}
      </button>
    </div>
  )
}
