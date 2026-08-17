import { useQuery } from '@tanstack/react-query'
import { getSeason } from '../../services/seasonService'
import CreateSeasonStep from './CreateSeasonStep'

export default function SeasonInfoStep({ seasonId }: { seasonId: number }) {
  const { data: season } = useQuery({
    queryKey: ['season', seasonId],
    queryFn: () => getSeason(seasonId),
  })

  if (!season) return null

  return <CreateSeasonStep season={season} readOnly />
}
