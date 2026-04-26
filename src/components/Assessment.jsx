import { motion } from 'framer-motion'
import TriageBadge from './TriageBadge'

function SectionTitle({ title }) {
  return <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">{title}</h3>
}

function Assessment({ report, isLoading, onBack, onRestart, onRegenerate }) {
  return (
    <div className="glass-card p-5 md:p-8">
      <h2 className="font-display text-xl font-semibold text-white md:text-2xl">Step 3: AI Assessment</h2>
      <p className="mt-2 text-sm text-slate-300">
        Clinical report generated through a secure serverless function. Always validate with clinical judgment.
      </p>

      {isLoading && (
        <div className="mt-8 rounded-2xl border border-cyan-300/30 bg-cyan-300/5 p-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="mx-auto h-10 w-10 rounded-full border-4 border-cyan-200/30 border-t-cyan-200"
          />
          <p className="mt-4 text-sm text-cyan-100">Generating structured clinical report...</p>
        </div>
      )}

      {!isLoading && !report && (
        <div className="mt-8 rounded-2xl border border-slate-600/70 bg-slate-900/30 p-6 text-sm text-slate-300">
          No assessment available. Try generating again.
        </div>
      )}

      {!isLoading && report && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-5">
          <div className="rounded-2xl border border-slate-600/70 bg-slate-900/30 p-5">
            <SectionTitle title="Triage Level" />
            <div className="mt-3">
              <TriageBadge level={report.triage} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-600/70 bg-slate-900/30 p-5">
            <SectionTitle title="Red Flags" />
            <ul className="mt-3 space-y-2 text-sm text-slate-100">
              {report.redFlags.map((flag) => (
                <li key={flag} className="rounded-lg bg-slate-800/50 px-3 py-2">
                  {flag}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-600/70 bg-slate-900/30 p-5">
            <SectionTitle title="Possible Conditions" />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {report.possibleConditions.map((condition, index) => (
                <article key={`${condition.condition}-${index}`} className="rounded-xl border border-slate-600/70 bg-slate-950/50 p-4">
                  <h4 className="font-semibold text-white">{condition.condition}</h4>
                  <p className="mt-1 text-xs uppercase tracking-[0.13em] text-cyan-200">
                    Likelihood: {condition.likelihood}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{condition.reasoning}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-600/70 bg-slate-900/30 p-5">
            <SectionTitle title="Recommended Actions" />
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-100">
              {report.recommendedActions.map((action, index) => (
                <li key={`${action}-${index}`}>{action}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-slate-600/70 bg-slate-900/30 p-5">
            <SectionTitle title="Vitals to Monitor" />
            <ul className="mt-3 flex flex-wrap gap-2 text-sm text-slate-100">
              {report.vitals.map((vital, index) => (
                <li key={`${vital}-${index}`} className="rounded-lg border border-emerald-300/35 bg-emerald-500/10 px-3 py-1.5">
                  {vital}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-5">
            <SectionTitle title="Medical Disclaimer" />
            <p className="mt-2 text-sm text-cyan-100">{report.disclaimer}</p>
          </div>

          <details className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
            <summary className="cursor-pointer text-sm text-slate-300">View Raw Model Output</summary>
            <pre className="mt-3 whitespace-pre-wrap text-xs text-slate-400">{report.rawText}</pre>
          </details>
        </motion.div>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <motion.button type="button" onClick={onBack} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="btn-secondary">
          Back to Symptoms
        </motion.button>

        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.button
            type="button"
            onClick={onRegenerate}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
            disabled={isLoading}
          >
            Regenerate Report
          </motion.button>
          <motion.button type="button" onClick={onRestart} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="btn-secondary">
            New Assessment
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default Assessment
