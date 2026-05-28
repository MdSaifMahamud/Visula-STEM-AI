'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart2, CheckCircle, Target, TrendingUp, BookOpen,
  AlertCircle, ArrowRight, Trophy, Clock
} from 'lucide-react'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts'
import { getProgressStats, getQuizAttempts, type ProgressStats } from '@/lib/progress'
import { getLessonById } from '@/lib/lessons'
import type { QuizAttempt } from '@/types/quiz'

function StatCard({ icon: Icon, label, value, color, sub }: {
  icon: React.ElementType; label: string; value: string | number; color: string; sub?: string
}) {
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-extrabold text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      </div>
    </div>
  )
}

export default function ProgressPage() {
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])

  useEffect(() => {
    setStats(getProgressStats())
    setAttempts(getQuizAttempts())
  }, [])

  if (!stats) return null

  const noData = attempts.length === 0

  // Chart data: quiz scores over time
  const scoreChartData = attempts.slice(-10).map((a, i) => ({
    name: `Q${i + 1}`,
    score: Math.round((a.score / a.totalQuestions) * 100),
    shape: a.shapeName,
  }))

  // Shape mastery chart
  const shapeScores: Record<string, { total: number; count: number }> = {}
  attempts.forEach((a) => {
    if (!shapeScores[a.shapeName]) shapeScores[a.shapeName] = { total: 0, count: 0 }
    shapeScores[a.shapeName].total += (a.score / a.totalQuestions) * 100
    shapeScores[a.shapeName].count += 1
  })
  const masteryData = Object.entries(shapeScores).map(([name, s]) => ({
    name,
    score: Math.round(s.total / s.count),
  }))

  const suggestedLessons = noData
    ? ['circle', 'triangle', 'parallelogram']
    : stats.weakTopics.slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">My Progress</h1>
            <p className="text-sm text-slate-500">Track your learning journey</p>
          </div>
        </div>
      </motion.div>

      {noData ? (
        /* Empty state */
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No progress yet</h2>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            Start learning! Take a quiz after any lesson to see your progress tracked here.
          </p>
          <Link href="/geometry" className="btn-primary">
            Start Learning
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={BookOpen} label="Lessons Visited" value={stats.totalLessonsVisited} color="#2563EB" />
            <StatCard icon={CheckCircle} label="Quizzes Taken" value={stats.totalQuizzesAttempted} color="#059669" />
            <StatCard icon={Trophy} label="Average Score" value={`${stats.averageScore}%`} color="#D97706"
              sub={stats.averageScore >= 70 ? 'Great performance!' : 'Keep practising!'} />
            <StatCard icon={Target} label="Strong Topics" value={stats.strongTopics.length} color="#7C3AED" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score over time */}
            <div className="card">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Quiz Scores Over Time</h3>
              {scoreChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={scoreChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
                    <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-400 text-sm text-center py-8">Complete more quizzes to see trends</p>
              )}
            </div>

            {/* Shape mastery */}
            <div className="card">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Shape Mastery</h3>
              {masteryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={masteryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
                    <Bar dataKey="score" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-400 text-sm text-center py-8">Complete quizzes to see mastery</p>
              )}
            </div>
          </div>

          {/* Strong vs Weak topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Strong Topics
              </h3>
              {stats.strongTopics.length > 0 ? (
                <div className="space-y-2">
                  {stats.strongTopics.map((id) => {
                    const lesson = getLessonById(id)
                    return lesson ? (
                      <div key={id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
                        <span className="text-sm font-medium text-emerald-700">{lesson.shape}</span>
                        <span className="badge badge-green">Strong</span>
                      </div>
                    ) : null
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Score 70%+ on quizzes to build strong topics</p>
              )}
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Weak Topics (Need Review)
              </h3>
              {stats.weakTopics.length > 0 ? (
                <div className="space-y-2">
                  {stats.weakTopics.map((id) => {
                    const lesson = getLessonById(id)
                    return lesson ? (
                      <div key={id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                        <span className="text-sm font-medium text-amber-700">{lesson.shape}</span>
                        <Link
                          href={lesson.routePath}
                          className="text-xs font-semibold text-amber-600 hover:underline"
                        >
                          Review →
                        </Link>
                      </div>
                    ) : null
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Complete more quizzes to identify weak areas</p>
              )}
            </div>
          </div>

          {/* Recent activity */}
          <div className="card">
            <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {stats.recentActivity.map((attempt) => {
                const pct = Math.round((attempt.score / attempt.totalQuestions) * 100)
                return (
                  <div key={attempt.id} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm
                      ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}>
                      {pct}%
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{attempt.shapeName} Quiz</p>
                      <p className="text-xs text-slate-400">
                        {attempt.score}/{attempt.totalQuestions} correct ·{' '}
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/geometry/${attempt.shapeName.toLowerCase()}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Revisit
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Suggested lessons */}
      <div className="mt-8 card">
        <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Suggested Next Lessons
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['circle', 'triangle', 'cylinder'].map((shape) => (
            <Link
              key={shape}
              href={`/geometry/${shape}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-200 transition-colors">
                {shape === 'circle' ? '○' : shape === 'triangle' ? '△' : '⬤'}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 capitalize">{shape}</p>
                <p className="text-xs text-slate-400">Start lesson →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
