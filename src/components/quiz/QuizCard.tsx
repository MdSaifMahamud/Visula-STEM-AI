'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react'
import type { Quiz, StudentAnswer } from '@/types/quiz'
import type { QuizAttempt } from '@/types/quiz'
import { saveQuizAttempt } from '@/lib/progress'

interface Props {
  quiz: Quiz
  lessonId: string
  shapeName: string
  accentColor?: string
  onComplete?: (attempt: QuizAttempt) => void
}

type Phase = 'intro' | 'question' | 'result'

export default function QuizCard({ quiz, lessonId, shapeName, accentColor = '#2563EB', onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<StudentAnswer[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [numericInput, setNumericInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [startTime] = useState(Date.now())

  const question = quiz.questions[currentQ]
  const isLast = currentQ === quiz.questions.length - 1

  const handleSelect = (optId: string) => {
    if (submitted) return
    setSelected(optId)
  }

  const handleSubmit = useCallback(() => {
    if (submitted) return
    const answer = question.questionType === 'numerical' ? numericInput.trim() : (selected ?? '')
    const isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase()

    setAnswers((prev) => [
      ...prev,
      { questionId: question.id, answer, isCorrect },
    ])
    setSubmitted(true)
  }, [submitted, question, numericInput, selected])

  const handleNext = () => {
    if (isLast) {
      // Compute final result
      const finalAnswers = [...answers]
      const score = finalAnswers.filter((a) => a.isCorrect).length
      const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}`,
        quizId: quiz.id,
        lessonId,
        shapeName,
        score,
        totalQuestions: quiz.questions.length,
        answers: finalAnswers,
        completedAt: new Date().toISOString(),
        timeTaken: Math.round((Date.now() - startTime) / 1000),
      }
      saveQuizAttempt(attempt)
      onComplete?.(attempt)
      setPhase('result')
    } else {
      setCurrentQ((q) => q + 1)
      setSelected(null)
      setNumericInput('')
      setSubmitted(false)
    }
  }

  const handleReset = () => {
    setPhase('intro')
    setCurrentQ(0)
    setAnswers([])
    setSelected(null)
    setNumericInput('')
    setSubmitted(false)
  }

  const finalScore = answers.filter((a) => a.isCorrect).length
  const pct = Math.round((finalScore / quiz.questions.length) * 100)

  if (phase === 'intro') {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="text-4xl">📝</div>
        <h3 className="text-lg font-bold text-slate-800">{quiz.title}</h3>
        <p className="text-sm text-slate-500">{quiz.questions.length} questions · {quiz.difficulty}</p>
        <button
          onClick={() => setPhase('question')}
          className="btn-primary"
          style={{ backgroundColor: accentColor }}
        >
          Start Quiz
        </button>
      </div>
    )
  }

  if (phase === 'result') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6 space-y-5"
      >
        <div className="text-5xl">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-800">
            {finalScore} / {quiz.questions.length} correct
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            {pct >= 80 ? 'Excellent! You really understand this topic.' :
             pct >= 50 ? 'Good effort! Review the derivation steps.' :
             'Keep practising! Use the simulation to understand better.'}
          </p>
        </div>

        {/* Score ring */}
        <div className="relative w-24 h-24 mx-auto">
          <svg className="w-24 h-24 -rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke={accentColor}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-extrabold text-slate-800">{pct}%</span>
          </div>
        </div>

        {/* Answer review */}
        <div className="text-left space-y-2 max-h-64 overflow-y-auto">
          {quiz.questions.map((q, i) => {
            const ans = answers[i]
            return (
              <div key={q.id} className={`rounded-lg px-3 py-2.5 text-sm border ${
                ans?.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-2">
                  {ans?.isCorrect
                    ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-medium text-slate-800">{q.questionText}</p>
                    {!ans?.isCorrect && (
                      <p className="text-xs text-slate-500 mt-0.5">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button onClick={handleReset} className="btn-ghost">
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </motion.div>
    )
  }

  /* Question phase */
  const isCorrect = submitted && (
    (question.questionType === 'numerical'
      ? numericInput.trim().toLowerCase() === question.correctAnswer.toLowerCase()
      : selected === question.correctAnswer)
  )

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accentColor }}
            animate={{ width: `${((currentQ) / quiz.questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0">{currentQ + 1}/{quiz.questions.length}</span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">{question.questionText}</p>

          {/* MCQ / Formula select */}
          {(question.questionType === 'MCQ' || question.questionType === 'formula-select') && question.options && (
            <div className="space-y-2">
              {question.options.map((opt) => {
                let state = 'default'
                if (submitted) {
                  if (opt.id === question.correctAnswer) state = 'correct'
                  else if (opt.id === selected) state = 'wrong'
                } else if (opt.id === selected) {
                  state = 'selected'
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    disabled={submitted}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150
                      ${state === 'correct' ? 'bg-emerald-50 border-emerald-400 text-emerald-800' :
                        state === 'wrong' ? 'bg-red-50 border-red-300 text-red-700' :
                        state === 'selected' ? 'border-2 text-slate-800' :
                        'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
                    style={state === 'selected' ? { borderColor: accentColor, backgroundColor: `${accentColor}08` } : {}}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0
                        ${state === 'correct' ? 'bg-emerald-500 border-emerald-500 text-white' :
                          state === 'wrong' ? 'bg-red-400 border-red-400 text-white' :
                          state === 'selected' ? 'border-current' : 'border-slate-300'}`}
                        style={state === 'selected' ? { borderColor: accentColor, color: accentColor } : {}}>
                        {opt.id.toUpperCase()}
                      </span>
                      {opt.text}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Numerical input */}
          {question.questionType === 'numerical' && (
            <div className="space-y-2">
              <input
                type="number"
                value={numericInput}
                onChange={(e) => !submitted && setNumericInput(e.target.value)}
                placeholder="Enter your answer..."
                disabled={submitted}
                className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-medium outline-none transition-colors
                  ${submitted
                    ? isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : 'border-red-300 bg-red-50 text-red-700'
                    : 'border-slate-200 focus:border-blue-400'}`}
                style={!submitted ? { borderColor: numericInput ? accentColor : undefined } : {}}
                onKeyDown={(e) => e.key === 'Enter' && numericInput && !submitted && handleSubmit()}
              />
              {submitted && !isCorrect && (
                <p className="text-xs text-slate-500">Correct answer: <span className="font-bold text-emerald-600">{question.correctAnswer}</span></p>
              )}
            </div>
          )}

          {/* Feedback */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 flex gap-3 ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}
            >
              {isCorrect
                ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                : <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
              <div>
                <p className={`text-sm font-semibold mb-1 ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite.'}
                </p>
                <p className="text-xs text-slate-600">{question.explanation}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selected && !numericInput}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed text-sm py-2 px-5"
            style={{ backgroundColor: accentColor }}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-primary flex items-center gap-2 text-sm py-2 px-5"
            style={{ backgroundColor: accentColor }}
          >
            {isLast ? (
              <><Trophy className="w-4 h-4" /> Finish</>
            ) : (
              <>Next <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
