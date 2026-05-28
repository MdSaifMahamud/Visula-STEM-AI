'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { BookOpen, Brain, Target, Info, ChevronLeft, Lock } from 'lucide-react'
import Link from 'next/link'
import { getLessonByShape } from '@/lib/lessons'

// Wrapper ensures useSearchParams is inside a Suspense boundary (required by Next.js 14)
export default function LessonPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96"><div className="w-8 h-8 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin" /></div>}>
      <LessonPage />
    </Suspense>
  )
}
import FormulaStepViewer from '@/components/formula/FormulaStepViewer'
import AIQuizCard from '@/components/quiz/AIQuizCard'
import AITutorPanel from '@/components/ai/AITutorPanel'

// 2D Simulations
const CircleSimulation = dynamic(() => import('@/components/simulations/two-d/CircleSimulation'), { ssr: false })
const TriangleSimulation = dynamic(() => import('@/components/simulations/two-d/TriangleSimulation'), { ssr: false })
const ParallelogramSimulation = dynamic(() => import('@/components/simulations/two-d/ParallelogramSimulation'), { ssr: false })
const TrapeziumSimulation = dynamic(() => import('@/components/simulations/two-d/TrapeziumSimulation'), { ssr: false })

// 3D Simulations (dynamic import with no SSR for Three.js)
const CubeSimulation = dynamic(() => import('@/components/simulations/three-d/CubeSimulation'), { ssr: false })
const CylinderSimulation = dynamic(() => import('@/components/simulations/three-d/CylinderSimulation'), { ssr: false })
const ConeSimulation = dynamic(() => import('@/components/simulations/three-d/ConeSimulation'), { ssr: false })
const SphereSimulation = dynamic(() => import('@/components/simulations/three-d/SphereSimulation'), { ssr: false })

type Tab = 'simulation' | 'derivation' | 'quiz' | 'ai-tutor'

function SimulationLoader({ shape, accentColor }: { shape: string; accentColor: string }) {
  switch (shape.toLowerCase()) {
    case 'circle': return <CircleSimulation accentColor={accentColor} />
    case 'triangle': return <TriangleSimulation accentColor={accentColor} />
    case 'parallelogram': return <ParallelogramSimulation accentColor={accentColor} />
    case 'trapezium': return <TrapeziumSimulation accentColor={accentColor} />
    case 'cube': return <CubeSimulation accentColor={accentColor} isCuboid={false} />
    case 'cuboid': return <CubeSimulation accentColor={accentColor} isCuboid={true} />
    case 'cylinder': return <CylinderSimulation accentColor={accentColor} />
    case 'cone': return <ConeSimulation accentColor={accentColor} />
    case 'sphere': return <SphereSimulation accentColor={accentColor} />
    default:
      return (
        <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
          <div className="text-5xl">🚧</div>
          <p className="text-sm font-medium">Simulation coming soon!</p>
        </div>
      )
  }
}

function SimulationFallback() {
  return (
    <div className="flex items-center justify-center h-64 bg-slate-50 rounded-2xl">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm">Loading simulation...</p>
      </div>
    </div>
  )
}

function LessonPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const shapeParam = (params.shape as string) ?? 'circle'
  const defaultTab = searchParams.get('tab') === 'quiz' ? 'quiz' : 'simulation'

  const lesson = getLessonByShape(shapeParam)

  const [activeTab, setActiveTab] = useState<Tab>(defaultTab as Tab)

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <div className="text-5xl">🔍</div>
        <h1 className="text-xl font-bold text-slate-800">Lesson not found</h1>
        <p className="text-slate-500">The shape &quot;{shapeParam}&quot; doesn&apos;t have a lesson yet.</p>
        <Link href="/geometry" className="btn-primary text-sm">Browse All Lessons</Link>
      </div>
    )
  }

  if (!lesson.available) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <Lock className="w-12 h-12 text-slate-300" />
        <h1 className="text-xl font-bold text-slate-800">{lesson.title}</h1>
        <p className="text-slate-500">This lesson is coming soon. Stay tuned!</p>
        <Link href="/geometry" className="btn-primary text-sm">Back to Dashboard</Link>
      </div>
    )
  }

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'simulation', label: 'Simulation', icon: BookOpen },
    { key: 'derivation', label: 'Derivation', icon: Info },
    { key: 'quiz', label: 'Quiz', icon: Target },
    { key: 'ai-tutor', label: 'AI Tutor', icon: Brain },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
        <Link href="/geometry" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Geometry
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">{lesson.title}</span>
      </div>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm shrink-0"
            style={{ backgroundColor: `${lesson.color}15`, color: lesson.color }}
          >
            {lesson.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900">{lesson.title}</h1>
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
            <p className="text-slate-500 text-sm">{lesson.description}</p>
          </div>
          {/* Formula pill */}
          <div
            className="hidden sm:flex items-center font-mono font-bold text-lg px-5 py-2 rounded-xl shrink-0"
            style={{ backgroundColor: `${lesson.color}12`, color: lesson.color }}
          >
            {lesson.formula}
          </div>
        </div>
      </motion.div>

      {/* Mobile formula */}
      <div
        className="sm:hidden formula-box mb-5 text-base"
        style={{ borderColor: `${lesson.color}40`, color: lesson.color }}
      >
        {lesson.formula}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Simulation / Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Tab navigation */}
          <div className="flex bg-white border border-slate-200 rounded-2xl p-1.5 gap-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-semibold transition-all
                  ${activeTab === tab.key
                    ? 'text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                style={activeTab === tab.key ? { backgroundColor: lesson.color } : {}}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="card min-h-96">
            {activeTab === 'simulation' && (
              <Suspense fallback={<SimulationFallback />}>
                <SimulationLoader shape={lesson.shape} accentColor={lesson.color} />
              </Suspense>
            )}

            {activeTab === 'derivation' && (
              <div className="space-y-5">
                <div>
                  <h2 className="section-title text-lg mb-1">Visual Proof: Why does {lesson.formula} work?</h2>
                  <p className="text-sm text-slate-500">Follow each step to understand why the formula is what it is.</p>
                </div>
                <FormulaStepViewer steps={lesson.derivationSteps} accentColor={lesson.color} />
              </div>
            )}

            {activeTab === 'quiz' && (
              <AIQuizCard
                lessonId={lesson.id}
                lessonTitle={lesson.title}
                shapeName={lesson.shape}
                formula={lesson.formula}
                accentColor={lesson.color}
              />
            )}

            {activeTab === 'ai-tutor' && (
              <div style={{ height: '480px' }} className="flex flex-col">
                <AITutorPanel
                  lessonContext={lesson.title}
                  shapeName={lesson.shape}
                  accentColor={lesson.color}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right column: Formula panel + Real-life examples + quick AI tutor */}
        <div className="space-y-5">
          {/* Formula card */}
          <div className="card space-y-4">
            <h3 className="text-base font-semibold text-slate-800">Formula</h3>
            <div
              className="rounded-xl px-5 py-4 font-mono text-xl font-bold text-center"
              style={{ backgroundColor: `${lesson.color}12`, color: lesson.color }}
            >
              {lesson.formula}
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              {lesson.description}
            </div>
          </div>

          {/* Derivation quick-view */}
          {lesson.derivationSteps.length > 0 && (
            <div className="card">
              <FormulaStepViewer steps={lesson.derivationSteps} accentColor={lesson.color} />
            </div>
          )}

          {/* Real-life examples */}
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Real-Life Examples</h3>
            <div className="flex flex-wrap gap-2">
              {lesson.realLifeExamples.map((ex) => (
                <span
                  key={ex}
                  className="text-xs px-2.5 py-1 rounded-full border font-medium"
                  style={{ borderColor: `${lesson.color}30`, color: lesson.color, backgroundColor: `${lesson.color}08` }}
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>

          {/* Quick AI Tutor (desktop) */}
          <div className="card hidden lg:flex flex-col" style={{ height: '320px' }}>
            <AITutorPanel
              lessonContext={lesson.title}
              shapeName={lesson.shape}
              accentColor={lesson.color}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
