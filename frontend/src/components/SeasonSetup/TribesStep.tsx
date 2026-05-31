import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSeason, createTribe, deleteTribe } from '../../services/seasonService'
import BackButton from './BackButton'

export default function TribesStep({ seasonId, onNext, onBack }: { seasonId: number; onNext: () => void; onBack?: () => void }) {
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
    <div className="p-8 max-w-lg">
      {onBack && <BackButton onClick={onBack} />}
      <h1>Add Tribes</h1>

      <ul className="space-y-2 mb-6">
        {season?.tribes.map((tribe) => (
          <li key={tribe.id} className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{ background: tribe.color }}
            />
            <span className="flex-1">{tribe.name}</span>
            <button
              onClick={() => deleteMutation.mutate(tribe.id)}
              disabled={deleteMutation.isPending}
              className="text-red-500 text-sm disabled:opacity-50"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate() }} className="space-y-3 mb-6">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label htmlFor="tribe-name" className="block text-sm font-medium mb-1">Tribe name</label>
            <input
              id="tribe-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-[var(--border)] rounded px-3 py-2 bg-[var(--bg)]"
            />
          </div>
          <div>
            <label htmlFor="tribe-color" className="block text-sm font-medium mb-1">Color</label>
            <input
              id="tribe-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border border-[var(--border)]"
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded disabled:opacity-50 whitespace-nowrap"
          >
            {createMutation.isPending ? 'Adding…' : 'Add Tribe'}
          </button>
        </div>
        {createMutation.error && <p className="text-red-500 text-sm">{(createMutation.error as Error).message}</p>}
        {deleteMutation.error && <p className="text-red-500 text-sm">{(deleteMutation.error as Error).message}</p>}
      </form>

      <button
        onClick={onNext}
        className="px-4 py-2 border border-[var(--border)] rounded"
      >
        Next: Add Players →
      </button>
    </div>
  )
}
