'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Sparkles, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type { AIQuestion } from '@/app/api/generate-quiz/route'
import { saveQuizAttempt } from '@/lib/progress'

interface Props {
  lessonId: string
  lessonTitle: string
  shapeName: string
  formula: string
  accentColor?: string
}

type Difficulty = 'easy' | 'medium' | 'hard'
type Phase = 'setup' | 'generating' | 'question' | 'result'

const DIFFICULTY_CONFIG = {
  easy:   { label: 'Easy',   color: '#16a34a', bg: '#f0fdf4', border: '#86efac', desc: 'Simple substitution, whole numbers' },
  medium: { label: 'Medium', color: '#d97706', bg: '#fffbeb', border: '#fcd34d', desc: 'Multi-step, word problems' },
  hard:   { label: 'Hard',   color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', desc: 'Reverse problems, algebraic' },
}

const COUNT_OPTIONS = [3, 5, 7, 10]

function MathText({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{ p: ({ children }) => <span>{children}</span> }}
    >
      {children}
    </ReactMarkdown>
  )
}

function isNumericalCorrect(userAnswer: string, correctAnswer: string): boolean {
  const user = parseFloat(userAnswer.replace(',', '.'))
  const correct = parseFloat(correctAnswer.replace(',', '.'))
  if (isNaN(user) || isNaN(correct)) return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
  if (correct === 0) return user === 0
  return Math.abs(user - correct) / Math.abs(correct) <= 0.05
}

export default function AIQuizCard({ lessonId, lessonTitle, shapeName, formula, accentColor = '#2563EB' }: Props) {
  const [phase, setPhase] = useState<Phase>('setup')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [count, setCount] = useState(5)
  const [questions, setQuestions] = useState<AIQuestion[]>([])
  const [error, setError] = useState('')

  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [numericInput, setNumericInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [scores, setScores] = useState<boolean[]>([])
  const [startTime] = useState(Date.now())

  const generateQuiz = async () => {
    setError('')
    setPhase('generating')
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shapeName, lessonTitle, formula, difficulty, count }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? 'Generation failed')
      setQuestions(data.questions)
      setCurrentQ(0)
      setSelected(null)
      setNumericInput('')
      setSubmitted(false)
      setScores([])
      setPhase('question')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz')
      setPhase('setup')
    }
  }

  const handleSubmit = useCallback(() => {
    if (submitted) return
    const q = questions[currentQ]
    let correct = false
    if (q.type === 'mcq') {
      correct = selected === q.correctIndex
    } else {
      correct = isNumericalCorrect(numericInput, q.answer ?? '')
    }
    setScores((prev) => [...prev, correct])
    setSubmitted(true)
  }, [submitted, questions, currentQ, selected, numericInput])

  const handleNext = () => {
    const isLast = currentQ === questions.length - 1
    if (isLast) {
      const finalScores = [...scores]
      const score = finalScores.filter(Boolean).length
      saveQuizAttempt({
        id: `attempt-${Date.now()}`,
        quizId: `ai-${shapeName}-${difficulty}`,
        lessonId,
        shapeName,
        score,
        totalQuestions: questions.length,
        answers: questions.map((_, i) => ({
          questionId: `q${i}`,
          answer: '',
          isCorrect: finalScores[i] ?? false,
        })),
        completedAt: new Date().toISOString(),
        timeTaken: Math.round((Date.now() - startTime) / 1000),
      })
      setPhase('result')
    } else {
      setCurrentQ((q) => q + 1)
      setSelected(null)
      setNumericInput('')
      setSubmitted(false)
    }
  }

  const restart = () => {
    setPhase('setup')
    setQuestions([])
    setScores([])
    setCurrentQ(0)
    setSelected(null)
    setNumericInput('')
    setSubmitted(false)
  }

  /* ── SETUP ── */
  if (phase === 'setup') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-2">
        <div className="text-center">
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="text-lg font-bold text-slate-800">AI Quiz Generator</h3>
          <p className="text-sm text-slate-500 mt-1">Unique questions every time, tailored to your level</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error} — Please try again.
          </div>
        )}

        {/* Difficulty */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Difficulty</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG.easy][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setDifficulty(key)}
                className="rounded-xl border-2 px-3 py-3 text-center transition-all"
                style={difficulty === key
                  ? { borderColor: cfg.color, backgroundColor: cfg.bg, color: cfg.color }
                  : { borderColor: '#e2e8f0', color: '#64748b' }}
              >
                <div className="font-bold text-sm">{cfg.label}</div>
                <div className="text-xs mt-0.5 leading-tight opacity-80">{cfg.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Number of Questions</p>
          <div className="flex gap-2">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className="flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                style={count === n
                  ? { borderColor: accentColor, backgroundColor: `${accentColor}10`, color: accentColor }
                  : { borderColor: '#e2e8f0', color: '#64748b' }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateQuiz}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: accentColor }}
        >
          <Sparkles className="w-4 h-4" />
          Generate {count} {DIFFICULTY_CONFIG[difficulty].label} Questions
        </button>
      </motion.div>
    )
  }

  /* ── GENERATING ── */
  if (phase === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: accentColor }} />
        <div className="text-center">
          <p className="font-semibold text-slate-700">Generating your quiz…</p>
          <p className="text-sm text-slate-400 mt-1">Creating {count} {DIFFICULTY_CONFIG[difficulty].label.toLowerCase()} questions about {shapeName}</p>
        </div>
      </div>
    )
  }

  /* ── RESULT ── */
  if (phase === 'result') {
    const finalScore = scores.filter(Boolean).length
    const pct = Math.round((finalScore / questions.length) * 100)
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-5">
        <div className="text-5xl">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-800">{finalScore} / {questions.length} correct</h3>
          <p className="text-slate-500 text-sm mt-1">
            {pct >= 80 ? 'Excellent! You really understand this topic.' :
             pct >= 50 ? 'Good effort! Review the derivation steps.' :
             'Keep practising! Use the simulation to understand better.'}
          </p>
          <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ backgroundColor: `${DIFFICULTY_CONFIG[difficulty].bg}`, color: DIFFICULTY_CONFIG[difficulty].color, border: `1px solid ${DIFFICULTY_CONFIG[difficulty].border}` }}>
            {DIFFICULTY_CONFIG[difficulty].label} · {questions.length} questions
          </span>
        </div>

        {/* Score ring */}
        <div className="relative w-24 h-24 mx-auto">
          <svg className="w-24 h-24 -rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle cx="48" cy="48" r="40" fill="none" stroke={accentColor} strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-extrabold text-slate-800">{pct}%</span>
          </div>
        </div>

        {/* Review */}
        <div className="text-left space-y-2 max-h-56 overflow-y-auto pr-1">
          {questions.map((q, i) => (
            <div key={i} className={`rounded-lg px-3 py-2.5 text-sm border ${scores[i] ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-2">
                {scores[i]
                  ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                <div>
                  <p className="font-medium text-slate-800">{q.question}</p>
                  {!scores[i] && <p className="text-xs text-slate-500 mt-0.5">{q.explanation}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-center">
          <button onClick={restart} className="btn-ghost flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> New Quiz
          </button>
          <button onClick={generateQuiz}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold"
            style={{ backgroundColor: accentColor }}>
            <Sparkles className="w-4 h-4" /> Try Again
          </button>
        </div>
      </motion.div>
    )
  }

  /* ── QUESTION ── */
  const q = questions[currentQ]
  const isLast = currentQ === questions.length - 1
  const isCorrect = submitted && (
    q.type === 'mcq'
      ? selected === q.correctIndex
      : isNumericalCorrect(numericInput, q.answer ?? '')
  )
  const canSubmit = q.type === 'mcq' ? selected !== null : numericInput.trim().length > 0

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ backgroundColor: DIFFICULTY_CONFIG[difficulty].bg, color: DIFFICULTY_CONFIG[difficulty].color, border: `1px solid ${DIFFICULTY_CONFIG[difficulty].border}` }}>
            {DIFFICULTY_CONFIG[difficulty].label}
          </span>
        </div>
        <span className="text-xs text-slate-400">{currentQ + 1} / {questions.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: accentColor }}
          animate={{ width: `${(currentQ / questions.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }} className="space-y-4">

          {/* Question text */}
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            <MathText>{q.question}</MathText>
          </p>

          {/* MCQ options */}
          {q.type === 'mcq' && q.options && (
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                let state = 'default'
                if (submitted) {
                  if (idx === q.correctIndex) state = 'correct'
                  else if (idx === selected) state = 'wrong'
                } else if (idx === selected) state = 'selected'
                return (
                  <button key={idx} onClick={() => !submitted && setSelected(idx)} disabled={submitted}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150
                      ${state === 'correct' ? 'bg-emerald-50 border-emerald-400 text-emerald-800' :
                        state === 'wrong' ? 'bg-red-50 border-red-300 text-red-700' :
                        state === 'selected' ? 'border-2 text-slate-800' :
                        'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
                    style={state === 'selected' ? { borderColor: accentColor, backgroundColor: `${accentColor}08` } : {}}>
                    <span className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0
                        ${state === 'correct' ? 'bg-emerald-500 border-emerald-500 text-white' :
                          state === 'wrong' ? 'bg-red-400 border-red-400 text-white' :
                          state === 'selected' ? 'border-current' : 'border-slate-300'}`}
                        style={state === 'selected' ? { borderColor: accentColor, color: accentColor } : {}}>
                        {['A','B','C','D'][idx]}
                      </span>
                      <MathText>{opt.replace(/^[A-D]\)\s*/i, '')}</MathText>
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Numerical input */}
          {q.type === 'numerical' && (
            <div className="space-y-2">
              <input type="number" value={numericInput}
                onChange={(e) => !submitted && setNumericInput(e.target.value)}
                placeholder="Enter your answer…" disabled={submitted}
                className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-medium outline-none transition-colors
                  ${submitted
                    ? isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : 'border-red-300 bg-red-50 text-red-700'
                    : 'border-slate-200 focus:border-blue-400'}`}
                style={!submitted && numericInput ? { borderColor: accentColor } : {}}
                onKeyDown={(e) => e.key === 'Enter' && canSubmit && !submitted && handleSubmit()}
              />
              {submitted && !isCorrect && (
                <p className="text-xs text-slate-500">Correct answer: <span className="font-bold text-emerald-600">{q.answer}</span></p>
              )}
            </div>
          )}

          {/* Feedback */}
          {submitted && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 flex gap-3 ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
              {isCorrect
                ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
              <div>
                <p className={`text-sm font-semibold mb-1 ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite.'}
                </p>
                <p className="text-xs text-slate-600"><MathText>{q.explanation}</MathText></p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-between items-center pt-1">
        <button onClick={restart} className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> New Quiz
        </button>
        {!submitted ? (
          <button onClick={handleSubmit} disabled={!canSubmit}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed text-sm py-2 px-5"
            style={{ backgroundColor: accentColor }}>
            Submit
          </button>
        ) : (
          <button onClick={handleNext}
            className="btn-primary flex items-center gap-2 text-sm py-2 px-5"
            style={{ backgroundColor: accentColor }}>
            {isLast ? <><Trophy className="w-4 h-4" /> Finish</> : <>Next <ChevronRight className="w-4 h-4" /></>}
          </button>
        )}
      </div>
    </div>
  )
}
