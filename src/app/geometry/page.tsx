'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Play, Lock, Shapes } from 'lucide-react'
import { lessons } from '@/lib/lessons'
import type { Lesson } from '@/types/lesson'

function ShapeCard({ lesson }: { lesson: Lesson }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={lesson.available ? { y: -2 } : {}}
      className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow
        ${lesson.available ? 'border-slate-200 hover:shadow-card-hover cursor-pointer' : 'border-slate-100 opacity-60'}`}
    >
      {/* Colored top bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: lesson.color }} />

      <div className="p-5">
        {/* Shape icon + badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl font-bold"
            style={{ backgroundColor: `${lesson.color}15`, color: lesson.color }}
          >
            {lesson.icon}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`badge ${lesson.shapeType === '2D' ? 'badge-blue' : 'badge-purple'}`}>
              {lesson.shapeType}
            </span>
            <span className={`badge ${
              lesson.difficulty === 'Beginner' ? 'badge-green' :
              lesson.difficulty === 'Intermediate' ? 'badge-amber' : 'badge-purple'
            }`}>
              {lesson.difficulty}
            </span>
          </div>
        </div>

        {/* Shape name */}
        <h3 className="text-base font-bold text-slate-800 mb-1">{lesson.shape}</h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{lesson.description}</p>

        {/* Formula box */}
        <div className="bg-slate-50 rounded-lg px-3 py-2 mb-4 font-mono text-sm font-bold text-center"
          style={{ color: lesson.color }}>
          {lesson.formula}
        </div>

        {/* Action buttons */}
        {lesson.available ? (
          <div className="flex gap-2">
            <Link
              href={lesson.routePath}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2 rounded-lg transition-all"
              style={{ backgroundColor: `${lesson.color}15`, color: lesson.color }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Learn
            </Link>
            <Link
              href={`${lesson.routePath}?tab=quiz`}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              Practice
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm py-2">
            <Lock className="w-3.5 h-3.5" />
            Coming Soon
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function GeometryDashboard() {
  const shapes2D = lessons.filter((l) => l.shapeType === '2D')
  const shapes3D = lessons.filter((l) => l.shapeType === '3D')
  const availableCount = lessons.filter((l) => l.available).length

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
            <Shapes className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Geometry Dashboard</h1>
            <p className="text-sm text-slate-500">{availableCount} interactive lessons available</p>
          </div>
        </div>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Choose a shape to explore its formula visually. Each lesson includes an interactive simulation,
          step-by-step derivation, AI tutor, and practice quiz.
        </p>
      </motion.div>

      {/* ── 2D Shapes ───────────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="badge-blue text-sm px-3 py-1 font-semibold">2D</div>
          <h2 className="text-xl font-bold text-slate-800">2D Shapes</h2>
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-sm text-slate-400">{shapes2D.length} shapes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {shapes2D.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ShapeCard lesson={lesson} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3D Shapes ───────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="badge-purple text-sm px-3 py-1 font-semibold">3D</div>
          <h2 className="text-xl font-bold text-slate-800">3D Shapes</h2>
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-sm text-slate-400">{shapes3D.length} shapes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {shapes3D.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.3 }}
            >
              <ShapeCard lesson={lesson} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
