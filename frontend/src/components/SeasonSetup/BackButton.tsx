export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-sm underline mb-4 block">
      ← Back to seasons
    </button>
  )
}
