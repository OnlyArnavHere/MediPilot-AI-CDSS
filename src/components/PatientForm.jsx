import { motion } from 'framer-motion'

function PatientForm({ patientInfo, setPatientInfo, onNext }) {
  const updateField = (key, value) => {
    setPatientInfo((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="glass-card p-5 md:p-8">
      <h2 className="font-display text-xl font-semibold text-white md:text-2xl">Step 1: Patient Information</h2>
      <p className="mt-2 text-sm text-slate-300">Enter core demographics and optional clinical context.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="field-label">
          Age <span className="text-red-300">*</span>
          <input
            type="number"
            min="0"
            value={patientInfo.age}
            onChange={(event) => updateField('age', event.target.value)}
            className="field-input"
            placeholder="e.g. 45"
          />
        </label>

        <label className="field-label">
          Sex <span className="text-red-300">*</span>
          <select
            value={patientInfo.sex}
            onChange={(event) => updateField('sex', event.target.value)}
            className="field-input"
          >
            <option value="">Select sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Intersex">Intersex</option>
            <option value="Other">Other</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4">
        <label className="field-label">
          Medical History (optional)
          <textarea
            rows={3}
            value={patientInfo.medicalHistory}
            onChange={(event) => updateField('medicalHistory', event.target.value)}
            className="field-input resize-none"
            placeholder="Chronic conditions, surgeries, prior admissions..."
          />
        </label>

        <label className="field-label">
          Current Medications (optional)
          <textarea
            rows={3}
            value={patientInfo.medications}
            onChange={(event) => updateField('medications', event.target.value)}
            className="field-input resize-none"
            placeholder="Medication name, dose, frequency..."
          />
        </label>

        <label className="field-label">
          Allergies (optional)
          <textarea
            rows={3}
            value={patientInfo.allergies}
            onChange={(event) => updateField('allergies', event.target.value)}
            className="field-input resize-none"
            placeholder="Drug/food/environmental allergies..."
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="btn-primary"
          type="button"
        >
          Continue to Symptoms
        </motion.button>
      </div>
    </div>
  )
}

export default PatientForm
