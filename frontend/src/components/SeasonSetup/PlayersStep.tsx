import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSeason, createPlayer, deletePlayer } from '../../services/seasonService'

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

export default function PlayersStep({ seasonId }: { seasonId: number }) {
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

  const tribeMap = Object.fromEntries((season?.tribes ?? []).map((t) => [t.id, t]))

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-4xl font-serif font-medium mb-6">Add Players</h1>

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
              className="btn btn-ghost btn-xs text-error"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate() }} className="space-y-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input
            id="player-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Tribe (optional)</legend>
          <select
            id="player-tribe"
            value={tribeId}
            onChange={(e) => setTribeId(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">— unassigned —</option>
            {season?.tribes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          {STAT_FIELDS.map(({ key, label }) => (
            <fieldset key={key} className="fieldset">
              <legend className="fieldset-legend">{label}: {stats[key]}</legend>
              <input
                id={`stat-${key}`}
                type="range"
                min={1}
                max={10}
                value={stats[key]}
                onChange={(e) => setStats((s) => ({ ...s, [key]: parseInt(e.target.value) }))}
                className="range range-primary w-full"
              />
            </fieldset>
          ))}
        </div>

        {createMutation.error && <p className="text-error text-sm">{(createMutation.error as Error).message}</p>}
        {deleteMutation.error && <p className="text-error text-sm">{(deleteMutation.error as Error).message}</p>}

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="btn btn-primary"
        >
          {createMutation.isPending ? 'Adding…' : 'Add Player'}
        </button>
      </form>
    </div>
  )
}
