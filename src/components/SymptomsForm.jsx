import { motion } from 'framer-motion'
import SymptomChip from './SymptomChip'

function SymptomsForm({ options, symptoms, setSymptoms, onBack, onSubmit }) {
  const toggleSymptom = (symptom) => {
    setSymptoms((prev) => {
      const alreadySelected = prev.selectedSymptoms.includes(symptom)
      return {
        ...prev,
        selectedSymptoms: alreadySelected
          ? prev.selectedSymptoms.filter((item) => item !== symptom)
          : [...prev.selectedSymptoms, symptom],
      }
    })
  }

  return (
    <div className="glass-card p-5 md:p-8">
      <h2 className="font-display text-xl font-semibold text-white md:text-2xl">Step 2: Symptoms</h2>
      <p className="mt-2 text-sm text-slate-300">
        Select current symptoms and quantify symptom duration and severity.
      </p>

      <div className="mt-6">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">Select Symptoms</p>
        <div className="flex flex-wrap gap-2.5">
          {options.map((symptom) => (
            <SymptomChip
              key={symptom}
              label={symptom}
              selected={symptoms.selectedSymptoms.includes(symptom)}
              onToggle={() => toggleSymptom(symptom)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="field-label">
          Duration <span className="text-red-300">*</span>
          <select
            value={symptoms.duration}
            onChange={(event) =>
              setSymptoms((prev) => ({
                ...prev,
                duration: event.target.value,
              }))
            }
            className="field-input"
          >
            <option value="">Select duration</option>
            <option value="<24h">&lt;24h</option>
            <option value="1-3 days">1-3 days</option>
            <option value="4-7 days">4-7 days</option>
            <option value=">1 week">&gt;1 week</option>
          </select>
        </label>

        <label className="field-label">
          Severity: <span className="text-cyan-200">{symptoms.severity}/10</span>
          <input
            type="range"
            min={1}
            max={10}
            value={symptoms.severity}
            onChange={(event) =>
              setSymptoms((prev) => ({
                ...prev,
                severity: Number(event.target.value),
              }))
            }
            className="h-2 cursor-pointer appearance-none rounded-lg bg-slate-700 accent-cyan-300"
          />
        </label>
      </div>

      <div className="mt-7 flex flex-col justify-between gap-3 sm:flex-row">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="btn-secondary"
        >
          Back
        </motion.button>

        <motion.button
          type="button"
          onClick={onSubmit}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary"
        >
          Generate AI Assessment
        </motion.button>
      </div>
    </div>
  )
}

export default SymptomsForm
