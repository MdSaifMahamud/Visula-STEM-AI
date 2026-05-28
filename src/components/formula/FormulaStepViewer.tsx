'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, List, Eye } from 'lucide-react'
import type { FormulaStep } from '@/types/lesson'

interface Props {
  steps: FormulaStep[]
  accentColor?: string
}

export default function FormulaStepViewer({ steps, accentColor = '#2563EB' }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showAll, setShowAll] = useState(false)

  if (steps.length === 0) return null

  const step = steps[currentStep]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Formula Derivation</h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          {showAll ? <Eye className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
          {showAll ? 'Show Current' : 'Show All Steps'}
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentStep(i); setShowAll(false) }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentStep ? 'w-6' : 'w-1.5'
            } ${i <= currentStep ? 'opacity-100' : 'opacity-30'}`}
            style={{ backgroundColor: accentColor }}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      {showAll ? (
        /* All steps view */
        <div className="space-y-3">
          {steps.map((s) => (
            <div
              key={s.stepNumber}
              className="flex gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                style={{ backgroundColor: accentColor }}
              >
                {s.stepNumber}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">{s.title}</p>
                <p className="text-xs text-slate-600 mb-1">{s.explanation}</p>
                <code className="text-xs font-mono" style={{ color: accentColor }}>{s.formulaText}</code>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Current step view */
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border-2 p-5"
            style={{ borderColor: `${accentColor}30`, backgroundColor: `${accentColor}05` }}
          >
            {/* Step header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {step.stepNumber}
              </div>
              <div>
                <p className="text-xs text-slate-400">Step {step.stepNumber} of {steps.length}</p>
                <h4 className="text-sm font-semibold text-slate-800">{step.title}</h4>
              </div>
            </div>

            {/* Explanation */}
            <p className="text-sm text-slate-700 leading-relaxed mb-3">{step.explanation}</p>

            {/* Formula */}
            <div
              className="rounded-lg px-4 py-2.5 font-mono text-sm font-bold text-center"
              style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
            >
              {step.formulaText}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Navigation buttons */}
      {!showAll && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs text-slate-400">
            {currentStep + 1} / {steps.length}
          </span>

          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-1.5 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg"
            style={{ color: accentColor }}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
