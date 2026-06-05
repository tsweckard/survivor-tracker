import BackButton from './BackButton'

export default function SeasonLive({ onBack }: { onBack?: () => void }) {
  return (
    <div className="p-8">
      {onBack && <BackButton onClick={onBack} />}
      <h1 className="text-4xl font-bold mb-4">Season is live!</h1>
      <p>Setup complete. The episode loop will begin here.</p>
    </div>
  )
}
