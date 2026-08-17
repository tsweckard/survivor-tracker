export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn btn-outline">
      ← Back
    </button>
  )
}
