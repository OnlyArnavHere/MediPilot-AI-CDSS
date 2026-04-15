import { motion } from 'framer-motion'

const steps = [
  { id: 1, title: 'Patient Info' },
  { id: 2, title: 'Symptoms' },
  { id: 3, title: 'AI Assessment' },
]

function Stepper({ currentStep }) {
  return (
    <div className="glass-card px-4 py-5 md:px-7 md:py-6">
      <div className="flex items-center gap-3 md:gap-4">
        {steps.map((step, index) => {
          const isActive = step.id <= currentStep
          const isCurrent = step.id === currentStep

          return (
            <div key={step.id} className="flex flex-1 items-center gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <motion.div
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                    backgroundColor: isActive ? 'rgba(34,211,238,0.25)' : 'rgba(15,23,42,0.65)',
                    borderColor: isActive ? 'rgba(34,211,238,0.65)' : 'rgba(148,163,184,0.35)',
                  }}
                  transition={{ duration: 0.25 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold text-white"
                >
                  {step.id}
                </motion.div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] uppercase tracking-[0.18em] text-slate-400">Step {step.id}</p>
                  <p className="truncate text-sm font-medium text-slate-100">{step.title}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden flex-1 md:block">
                  <div className="h-0.5 rounded-full bg-slate-700">
                    <motion.div
                      className="h-full rounded-full bg-cyan-300"
                      initial={false}
                      animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                      transition={{ duration: 0.25 }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Stepper
