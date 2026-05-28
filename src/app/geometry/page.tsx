'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Play, Shapes, ChevronDown } from 'lucide-react'
import { lessons } from '@/lib/lessons'
import type { Lesson } from '@/types/lesson'

function ShapeCard({ lesson, compact = false, onExpandTypes, typesExpanded = false }: {
  lesson: Lesson
  compact?: boolean
  onExpandTypes?: () => void
  typesExpanded?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: lesson.color }} />
      <div className={compact ? 'p-3' : 'p-5'}>
        <div className="flex items-start justify-between mb-3">
          <div
            className={`rounded-xl flex items-center justify-center font-bold ${compact ? 'w-10 h-10 text-2xl' : 'w-14 h-14 text-3xl'}`}
            style={{ backgroundColor: `${lesson.color}15`, color: lesson.color }}
          >
            {lesson.icon}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`badge ${lesson.shapeType === '2D' ? 'badge-blue' : 'badge-purple'} ${compact ? 'text-[10px]' : ''}`}>
              {lesson.shapeType}
            </span>
            <span className={`badge ${
              lesson.difficulty === 'Beginner' ? 'badge-green' :
              lesson.difficulty === 'Intermediate' ? 'badge-amber' : 'badge-purple'
            } ${compact ? 'text-[10px]' : ''}`}>
              {lesson.difficulty}
            </span>
          </div>
        </div>

        <h3 className={`font-bold text-slate-800 dark:text-slate-100 mb-1 ${compact ? 'text-sm' : 'text-base'}`}>{lesson.title}</h3>
        <p className={`text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 ${compact ? 'text-[11px]' : 'text-xs'}`}>{lesson.description}</p>

        <div className={`bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-1.5 mb-3 font-mono font-bold text-center ${compact ? 'text-xs' : 'text-sm'}`}
          style={{ color: lesson.color }}>
          {lesson.formula}
        </div>

        <div className="flex gap-2">
          <Link href={lesson.routePath}
            className={`flex-1 flex items-center justify-center gap-1.5 font-semibold py-2 rounded-lg transition-all ${compact ? 'text-xs' : 'text-sm'}`}
            style={{ backgroundColor: `${lesson.color}15`, color: lesson.color }}>
            <BookOpen className="w-3 h-3" />
            Learn
          </Link>
          <Link href={`${lesson.routePath}?tab=quiz`}
            className={`flex-1 flex items-center justify-center gap-1.5 font-semibold py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all ${compact ? 'text-xs' : 'text-sm'}`}>
            <Play className="w-3 h-3" />
            Quiz
          </Link>
        </div>

        {onExpandTypes && (
          <button
            onClick={onExpandTypes}
            className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all border"
            style={{ borderColor: `${lesson.color}40`, color: lesson.color, backgroundColor: typesExpanded ? `${lesson.color}15` : `${lesson.color}08` }}
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${typesExpanded ? 'rotate-180' : ''}`} />
            {typesExpanded ? 'Hide Types' : 'Explore Types'}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function GeometryDashboard() {
  const [triangleExpanded, setTriangleExpanded] = useState(false)

  // Separate triangle sub-types from main shapes
  const triangleSubTypes = lessons.filter((l) => l.parentId === 'triangle-area')
  const mainShapes2D = lessons.filter((l) => l.shapeType === '2D' && !l.parentId)
  const shapes3D = lessons.filter((l) => l.shapeType === '3D')
  const availableCount = lessons.filter((l) => l.available).length

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
            <Shapes className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Geometry Dashboard</h1>
            <p className="text-sm text-slate-500">{availableCount} interactive lessons available</p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
          Choose a shape to explore its formula visually. Each lesson includes an interactive simulation,
          step-by-step derivation, AI tutor, and AI-generated quiz.
        </p>
      </motion.div>

      {/* ── 2D Shapes ─────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="badge-blue text-sm px-3 py-1 font-semibold">2D</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">2D Shapes</h2>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-sm text-slate-400">{mainShapes2D.length} shapes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {mainShapes2D.map((lesson, i) => (
            <motion.div key={lesson.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <ShapeCard
                lesson={lesson}
                onExpandTypes={lesson.id === 'triangle-area' ? () => setTriangleExpanded(v => !v) : undefined}
                typesExpanded={lesson.id === 'triangle-area' ? triangleExpanded : false}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Triangle Types sub-section (collapsible) ─────────────────────── */}
        <AnimatePresence>
          {triangleExpanded && (
            <motion.div
              key="triangle-types"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">△</div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Triangle Types</h3>
                      <p className="text-xs text-slate-500">Three triangles — each with unique properties and formula derivations</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTriangleExpanded(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-100"
                  >
                    Close ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {triangleSubTypes.map((lesson, i) => (
                    <motion.div key={lesson.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                      <ShapeCard lesson={lesson} compact />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── 3D Shapes ─────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="badge-purple text-sm px-3 py-1 font-semibold">3D</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">3D Shapes</h2>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-sm text-slate-400">{shapes3D.length} shapes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {shapes3D.map((lesson, i) => (
            <motion.div key={lesson.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 + 0.3 }}>
              <ShapeCard lesson={lesson} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
