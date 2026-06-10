import { useQuery } from '@tanstack/react-query'
import { getSeason } from '../../services/seasonService'

export default function SeasonInfoStep({ seasonId }: { seasonId: number }) {
  const { data: season } = useQuery({
    queryKey: ['season', seasonId],
    queryFn: () => getSeason(seasonId),
  })

  if (!season) return null

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-4xl font-bold mb-2">{season.name}</h1>
      <div className="space-y-1 text-base-content/60 text-sm mt-3">
        {season.season_number != null && <p>Season {season.season_number}</p>}
        {season.location && <p>{season.location}</p>}
        {season.premiered_on && <p>Premiered {season.premiered_on}</p>}
      </div>
    </div>
  )
}
