const colorByTriage = {
  Immediate: 'bg-red-500/20 text-red-100 border-red-400/70',
  Urgent: 'bg-orange-500/20 text-orange-100 border-orange-400/70',
  'Semi-Urgent': 'bg-yellow-400/20 text-yellow-100 border-yellow-300/70',
  'Non-Urgent': 'bg-green-500/20 text-green-100 border-green-400/70',
}

function TriageBadge({ level }) {
  const normalized = Object.keys(colorByTriage).find((item) => item.toLowerCase() === level?.toLowerCase()) ?? 'Non-Urgent'
  return (
    <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold ${colorByTriage[normalized]}`}>
      {normalized}
    </span>
  )
}

export default TriageBadge
