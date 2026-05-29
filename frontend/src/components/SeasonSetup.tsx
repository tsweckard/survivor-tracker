import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSeasonStore } from '../store/seasonStore'
import {
  createSeason,
  getSeason,
  activateSeason,
  createTribe,
  deleteTribe,
  createPlayer,
  deletePlayer,
  type PlayerPayload,
} from '../services/seasonService'

export default function SeasonSetup() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isLive, setIsLive] = useState(false)
  const { seasonId, setSeasonId } = useSeasonStore()

  if (isLive) return <SeasonLive />
  if (step === 1) return <CreateSeasonStep onCreated={(id) => { setSeasonId(id); setStep(2) }} />
  if (step === 2) return <TribesStep seasonId={seasonId!} onNext={() => setStep(3)} />
  return <PlayersStep seasonId={seasonId!} onActivated={() => setIsLive(true)} />
}

function SeasonLive() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Season is live!</h1>
      <p>Setup complete. The episode loop will begin here.</p>
    </div>
  )
}

function CreateSeasonStep({ onCreated }: { onCreated: (id: number) => void }) {
  const [name, setName] = useState('')
  const mutation = useMutation({
    mutationFn: () => createSeason(name),
    onSuccess: (season) => onCreated(season.id),
  })

  return (
    <div style={{ padding: 32, maxWidth: 480 }}>
      <h1>New Season</h1>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="season-name">Season name</label>
          <br />
          <input
            id="season-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', marginTop: 4 }}
          />
        </div>
        {mutation.error && (
          <p style={{ color: 'red' }}>{(mutation.error as Error).message}</p>
        )}
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating…' : 'Create Season'}
        </button>
      </form>
    </div>
  )
}

function TribesStep({ seasonId, onNext }: { seasonId: number; onNext: () => void }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#3b82f6')

  const { data: season } = useQuery({
    queryKey: ['season', seasonId],
    queryFn: () => getSeason(seasonId),
  })

  const createMutation = useMutation({
    mutationFn: () => createTribe(seasonId, { name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['season', seasonId] })
      setName('')
      setColor('#3b82f6')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (tribeId: number) => deleteTribe(seasonId, tribeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['season', seasonId] }),
  })

  return (
    <div style={{ padding: 32, maxWidth: 560 }}>
      <h1>Add Tribes</h1>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 20 }}>
        {season?.tribes.map((tribe) => (
          <li key={tribe.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span
              style={{
                width: 16, height: 16, borderRadius: '50%',
                background: tribe.color, display: 'inline-block', flexShrink: 0,
              }}
            />
            <span style={{ flex: 1 }}>{tribe.name}</span>
            <button
              onClick={() => deleteMutation.mutate(tribe.id)}
              disabled={deleteMutation.isPending}
              style={{ color: 'red' }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate() }} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="tribe-name">Tribe name</label>
            <br />
            <input
              id="tribe-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>
          <div>
            <label htmlFor="tribe-color">Color</label>
            <br />
            <input
              id="tribe-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ marginTop: 4, height: 36, width: 48, cursor: 'pointer' }}
            />
          </div>
          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Adding…' : 'Add Tribe'}
          </button>
        </div>
        {createMutation.error && (
          <p style={{ color: 'red' }}>{(createMutation.error as Error).message}</p>
        )}
        {deleteMutation.error && (
          <p style={{ color: 'red' }}>{(deleteMutation.error as Error).message}</p>
        )}
      </form>

      <button onClick={onNext}>Next: Add Players →</button>
    </div>
  )
}

const STAT_FIELDS: { key: keyof PlayerPayload; label: string }[] = [
  { key: 'athleticism', label: 'Athleticism' },
  { key: 'social', label: 'Social' },
  { key: 'strategic', label: 'Strategic' },
  { key: 'likability', label: 'Likability' },
  { key: 'loyalty', label: 'Loyalty' },
]

const defaultStats = { athleticism: 5, social: 5, strategic: 5, likability: 5, loyalty: 5 }

function PlayersStep({ seasonId, onActivated }: { seasonId: number; onActivated: () => void }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [tribeId, setTribeId] = useState<string>('')
  const [stats, setStats] = useState({ ...defaultStats })

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
    <div style={{ padding: 32, maxWidth: 640 }}>
      <h1>Add Players</h1>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 20 }}>
        {season?.players.map((player) => (
          <li key={player.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ flex: 1 }}>
              {player.name}
              {player.tribe_id && tribeMap[player.tribe_id] && (
                <span style={{ marginLeft: 8, color: tribeMap[player.tribe_id].color }}>
                  ({tribeMap[player.tribe_id].name})
                </span>
              )}
            </span>
            <button
              onClick={() => deleteMutation.mutate(player.id)}
              disabled={deleteMutation.isPending}
              style={{ color: 'red' }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate() }} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="player-name">Name</label>
          <br />
          <input
            id="player-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="player-tribe">Tribe (optional)</label>
          <br />
          <select
            id="player-tribe"
            value={tribeId}
            onChange={(e) => setTribeId(e.target.value)}
            style={{ width: '100%', marginTop: 4 }}
          >
            <option value="">— unassigned —</option>
            {season?.tribes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          {STAT_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label htmlFor={`stat-${key}`}>{label}: {stats[key]}</label>
              <br />
              <input
                id={`stat-${key}`}
                type="range"
                min={1}
                max={10}
                value={stats[key]}
                onChange={(e) => setStats((s) => ({ ...s, [key]: parseInt(e.target.value) }))}
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </div>

        {createMutation.error && (
          <p style={{ color: 'red' }}>{(createMutation.error as Error).message}</p>
        )}
        {deleteMutation.error && (
          <p style={{ color: 'red' }}>{(deleteMutation.error as Error).message}</p>
        )}

        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Adding…' : 'Add Player'}
        </button>
      </form>

      {activateMutation.error && (
        <p style={{ color: 'red' }}>{(activateMutation.error as Error).message}</p>
      )}
      <button
        onClick={() => activateMutation.mutate()}
        disabled={activateMutation.isPending}
        style={{ fontWeight: 'bold' }}
      >
        {activateMutation.isPending ? 'Activating…' : 'Activate Season'}
      </button>
    </div>
  )
}
