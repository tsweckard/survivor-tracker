import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createSeason } from '../../services/seasonService'
import BackButton from './BackButton'

export default function CreateSeasonStep({ onCreated, onBack }: { onCreated: (id: number) => void; onBack?: () => void }) {
  const [name, setName] = useState('')
  const mutation = useMutation({
    mutationFn: () => createSeason(name),
    onSuccess: (season) => onCreated(season.id),
  })

  return (
    <div className="p-8 max-w-lg">
      {onBack && <BackButton onClick={onBack} />}
      <h1>New Season</h1>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate() }} className="space-y-4">
        <div>
          <label htmlFor="season-name" className="block text-sm font-medium mb-1">Season name</label>
          <input
            id="season-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-[var(--border)] rounded px-3 py-2 bg-[var(--bg)]"
          />
        </div>
        {mutation.error && <p className="text-red-500 text-sm">{(mutation.error as Error).message}</p>}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded disabled:opacity-50"
        >
          {mutation.isPending ? 'Creating…' : 'Create Season'}
        </button>
      </form>
    </div>
  )
}
