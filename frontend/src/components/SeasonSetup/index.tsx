import { useState } from 'react'
import { useSeasonStore } from '../../store/seasonStore'
import SeasonLive from './SeasonLive'
import CreateSeasonStep from './CreateSeasonStep'
import TribesStep from './TribesStep'
import PlayersStep from './PlayersStep'

export default function SeasonSetup({ existingSeasonId, onBack }: { existingSeasonId?: number; onBack?: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(existingSeasonId ? 2 : 1)
  const [isLive, setIsLive] = useState(false)
  const { seasonId, setSeasonId } = useSeasonStore()

  if (existingSeasonId && !seasonId) setSeasonId(existingSeasonId)

  const activeSeasonId = seasonId ?? existingSeasonId!

  if (isLive) return <SeasonLive onBack={onBack} />
  if (step === 1) return <CreateSeasonStep onCreated={(id) => { setSeasonId(id); setStep(2) }} onBack={onBack} />
  if (step === 2) return <TribesStep seasonId={activeSeasonId} onNext={() => setStep(3)} onBack={onBack} />
  return <PlayersStep seasonId={activeSeasonId} onActivated={() => setIsLive(true)} onBack={onBack} />
}
