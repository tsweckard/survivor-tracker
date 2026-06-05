export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn btn-ghost btn-sm mb-4 pl-0">
      ← Back to seasons
    </button>
  )
}
