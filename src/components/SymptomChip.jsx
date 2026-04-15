import { motion } from 'framer-motion'

function SymptomChip({ label, selected, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-xl border px-4 py-2 text-sm transition ${
        selected
          ? 'border-cyan-300/70 bg-cyan-300/20 text-cyan-100 shadow-glow'
          : 'border-slate-600/80 bg-slate-900/40 text-slate-200 hover:border-cyan-300/45 hover:bg-cyan-300/10'
      }`}
    >
      {label}
    </motion.button>
  )
}

export default SymptomChip
