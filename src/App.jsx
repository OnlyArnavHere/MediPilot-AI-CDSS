import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Stepper from './components/Stepper'
import PatientForm from './components/PatientForm'
import SymptomsForm from './components/SymptomsForm'
import Assessment from './components/Assessment'

const symptomOptions = [
  'Fever',
  'Cough',
  'Shortness of Breath',
  'Chest Pain',
  'Fatigue',
  'Headache',
  'Dizziness',
  'Nausea',
  'Vomiting',
  'Diarrhea',
  'Abdominal Pain',
  'Back Pain',
  'Sore Throat',
  'Runny Nose',
  'Palpitations',
  'Confusion',
  'Rash',
  'Swelling',
  'Joint Pain',
  'Urinary Burning',
]

const initialPatientInfo = {
  age: '',
  sex: '',
  medicalHistory: '',
  medications: '',
  allergies: '',
}

const initialSymptoms = {
  selectedSymptoms: [],
  duration: '',
  severity: 5,
}

const buildClinicalPrompt = (patientInfo, symptoms) => {
  const symptomText = symptoms.selectedSymptoms.join(', ')

  return `
You are an AI Clinical Decision Support System assistant.
Provide concise, safety-first clinical guidance for a clinician-facing triage support view.
If details are uncertain, say so explicitly. Do not invent data.

Patient Data:
- Age: ${patientInfo.age}
- Sex: ${patientInfo.sex}
- Medical History: ${patientInfo.medicalHistory || 'Not provided'}
- Current Medications: ${patientInfo.medications || 'Not provided'}
- Allergies: ${patientInfo.allergies || 'Not provided'}

Symptoms Data:
- Selected Symptoms: ${symptomText}
- Duration: ${symptoms.duration}
- Severity: ${symptoms.severity}/10

Output format is STRICT. Use exactly these section labels and order:
Triage Level: <Immediate | Urgent | Semi-Urgent | Non-Urgent>

Red Flags:
- <flag or "None identified based on provided data">

Possible Conditions:
1. Condition name: <condition>
Likelihood: <High | Medium | Low>
Clinical reasoning: <brief rationale>
2. Condition name: <condition>
Likelihood: <High | Medium | Low>
Clinical reasoning: <brief rationale>

Recommended Actions:
1. <action>
2. <action>
3. <action>

Vitals to Monitor:
- <vital>
- <vital>

Medical Disclaimer:
<disclaimer text>
`.trim()
}

const parseLines = (block) =>
  block
    .split('\n')
    .map((line) => line.trim())
    .map((line) => line.replace(/^\*\*(.+)\*\*:?$/, '$1').trim())
    .filter(Boolean)

const stripListPrefix = (line) => line.replace(/^[-*]\s*/, '').replace(/^\d+[.)]\s*/, '').trim()

const headingRegex = (heading) => heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const extractSection = (text, startHeadings, endHeadings) => {
  const startPattern = startHeadings.map(headingRegex).join('|')
  const endPattern = endHeadings.length ? endHeadings.map(headingRegex).join('|') : null
  const regex = new RegExp(
    endPattern
      ? `(?:^|\\n)\\s*(?:\\*\\*)?(?:${startPattern})(?:\\*\\*)?\\s*:?\\s*\\n?([\\s\\S]*?)(?=(?:\\n\\s*(?:\\*\\*)?(?:${endPattern})(?:\\*\\*)?\\s*:?\\s*)|$)`
      : `(?:^|\\n)\\s*(?:\\*\\*)?(?:${startPattern})(?:\\*\\*)?\\s*:?\\s*\\n?([\\s\\S]*)$`,
    'i',
  )
  return text.match(regex)?.[1]?.trim() ?? ''
}

const parseConditions = (block) => {
  const chunks = block
    .split(/\n(?=\d+\.\s*Condition name:)/i)
    .map((item) => item.trim())
    .filter(Boolean)

  return chunks
    .map((chunk) => {
      const conditionName =
        chunk.match(/Condition name:\s*(.+)/i)?.[1]?.trim() ??
        chunk.match(/^\d+\.\s*(.+)/)?.[1]?.trim() ??
        'Unspecified condition'
      const likelihood = chunk.match(/Likelihood:\s*(High|Medium|Low)/i)?.[1] ?? 'Low'
      const reasoning = chunk.match(/Clinical reasoning:\s*([\s\S]+)/i)?.[1]?.trim() ?? 'Not provided.'

      return {
        condition: conditionName,
        likelihood: likelihood[0].toUpperCase() + likelihood.slice(1).toLowerCase(),
        reasoning,
      }
    })
    .slice(0, 5)
}

const parseClinicalReport = (rawText) => {
  const triage =
    rawText.match(/Triage Level:\s*(Immediate|Urgent|Semi-Urgent|Non-Urgent)/i)?.[1] ??
    rawText.match(/Triage:\s*(Immediate|Urgent|Semi-Urgent|Non-Urgent)/i)?.[1] ??
    'Non-Urgent'

  const redFlagsBlock = extractSection(rawText, ['Red Flags'], ['Possible Conditions', 'Recommended Actions', 'Vitals to Monitor', 'Medical Disclaimer'])
  const conditionsBlock = extractSection(rawText, ['Possible Conditions', 'Differential Diagnosis'], ['Recommended Actions', 'Vitals to Monitor', 'Medical Disclaimer'])
  const actionsBlock = extractSection(rawText, ['Recommended Actions', 'Recommendations', 'Management Plan'], ['Vitals to Monitor', 'Monitoring', 'Medical Disclaimer'])
  const vitalsBlock = extractSection(rawText, ['Vitals to Monitor', 'Monitoring', 'Vitals'], ['Medical Disclaimer'])
  const disclaimer =
    extractSection(rawText, ['Medical Disclaimer', 'Disclaimer'], []) ||
    rawText.match(/Medical Disclaimer:\s*([\s\S]*)$/i)?.[1]?.trim() ||
    'This output is decision support only and does not replace clinician judgment or emergency care.'

  const redFlags = parseLines(redFlagsBlock).map(stripListPrefix).filter(Boolean)
  const possibleConditions = parseConditions(conditionsBlock)
  const recommendedActions = parseLines(actionsBlock).map(stripListPrefix).filter(Boolean)
  const vitals = parseLines(vitalsBlock).map(stripListPrefix).filter(Boolean)

  return {
    triage,
    redFlags: redFlags.length ? redFlags : ['None identified based on provided data.'],
    possibleConditions: possibleConditions.length
      ? possibleConditions
      : [{ condition: 'Unable to parse condition', likelihood: 'Low', reasoning: 'Response format mismatch.' }],
    recommendedActions: recommendedActions.length
      ? recommendedActions
      : [
          'Perform focused in-person clinical assessment and correlate with full history and exam findings.',
          'Monitor symptom progression and key vitals; escalate care immediately if red flags appear.',
          'Provide safety-net instructions and clear follow-up timeframe based on clinical judgment.',
        ],
    vitals: vitals.length ? vitals : ['Heart rate', 'Respiratory rate', 'Blood pressure', 'Temperature', 'SpO2'],
    disclaimer,
    rawText,
  }
}

function App() {
  const [step, setStep] = useState(1)
  const [patientInfo, setPatientInfo] = useState(initialPatientInfo)
  const [symptoms, setSymptoms] = useState(initialSymptoms)
  const [assessment, setAssessment] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const canProceedPatient = useMemo(() => patientInfo.age && patientInfo.sex, [patientInfo])
  const canAssess = useMemo(
    () => symptoms.selectedSymptoms.length > 0 && symptoms.duration && patientInfo.age && patientInfo.sex,
    [symptoms, patientInfo],
  )

  const nextFromPatient = () => {
    if (!canProceedPatient) {
      setError('Age and sex are required to continue.')
      return
    }
    setError('')
    setStep(2)
  }

  const previousStep = () => {
    setError('')
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handleGenerateAssessment = async () => {
    if (!canAssess) {
      setError('Please complete required fields and select at least one symptom with duration.')
      return
    }

    setError('')
    setAssessment(null)
    setStep(3)
    setIsLoading(true)

    try {
      const prompt = buildClinicalPrompt(patientInfo, symptoms)
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error (${response.status}). Make sure Ollama is running locally.`)
      }

      const data = await response.json()
      const modelText = data.response?.trim()

      if (!modelText) {
        throw new Error('Model returned an empty response.')
      }

      setAssessment(parseClinicalReport(modelText))
    } catch (requestError) {
      setError(requestError.message || 'Unable to generate assessment.')
    } finally {
      setIsLoading(false)
    }
  }

  const restart = () => {
    setStep(1)
    setPatientInfo(initialPatientInfo)
    setSymptoms(initialSymptoms)
    setAssessment(null)
    setError('')
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#050816] text-slate-100">
      <div className="relative overflow-hidden px-4 py-8 md:px-8 md:py-12">
        <div className="pointer-events-none absolute -left-40 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-36 top-48 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="mx-auto max-w-5xl">
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8 text-center md:mb-10"
          >
            <p className="mb-3 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              AI-Powered Clinical Decision Support
            </p>
            <h1 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
              AI-CDSS Triage Assistant
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
              Structured symptom intake with instant local AI assessment via Ollama.
            </p>
          </motion.header>

          <Stepper currentStep={step} />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.section
                key="patient-step"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <PatientForm
                  patientInfo={patientInfo}
                  setPatientInfo={setPatientInfo}
                  onNext={nextFromPatient}
                />
              </motion.section>
            )}

            {step === 2 && (
              <motion.section
                key="symptoms-step"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <SymptomsForm
                  options={symptomOptions}
                  symptoms={symptoms}
                  setSymptoms={setSymptoms}
                  onBack={previousStep}
                  onSubmit={handleGenerateAssessment}
                />
              </motion.section>
            )}

            {step === 3 && (
              <motion.section
                key="assessment-step"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <Assessment
                  report={assessment}
                  isLoading={isLoading}
                  onBack={previousStep}
                  onRestart={restart}
                  onRegenerate={handleGenerateAssessment}
                />
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}

export default App
