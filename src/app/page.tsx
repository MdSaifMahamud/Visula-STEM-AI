'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Brain, Zap, BookOpen, BarChart2, MessageCircle, CheckCircle,
  ArrowRight, Star, Play, Layers, Calculator, Target
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

const features = [
  {
    icon: BookOpen,
    title: 'Interactive 2D Geometry',
    description: 'Watch circle sectors rearrange into rectangles, triangles fold into parallelograms — see why formulas work.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    icon: Layers,
    title: '3D Shape Explorer',
    description: 'Rotate, zoom, and unfold 3D shapes. See how a cube net becomes 6 faces, or how cylinders stack.',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    icon: Calculator,
    title: 'Formula Derivation',
    description: 'Step-by-step visual proof of every formula. Understand the WHY, not just the WHAT.',
    color: 'from-cyan-500 to-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
  },
  {
    icon: Brain,
    title: 'AI Tutor',
    description: 'Ask any question about the current lesson. Get explanations in English or Bangla.',
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    icon: Target,
    title: 'Smart Quizzes',
    description: 'MCQ, numerical, and visual questions with instant feedback and detailed explanations.',
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    icon: BarChart2,
    title: 'Progress Tracking',
    description: 'Track strong and weak topics, quiz scores, and get personalized lesson recommendations.',
    color: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
  },
]

const heroShapes = [
  { symbol: 'π', color: 'bg-blue-500/20 text-blue-300', size: 'text-4xl', delay: 0, x: 100, y: 80 },
  { symbol: '△', color: 'bg-purple-500/20 text-purple-300', size: 'text-3xl', delay: 0.5, x: 220, y: 200 },
  { symbol: '○', color: 'bg-cyan-500/20 text-cyan-300', size: 'text-5xl', delay: 1, x: 80, y: 280 },
  { symbol: '□', color: 'bg-pink-500/20 text-pink-300', size: 'text-3xl', delay: 1.5, x: 280, y: 120 },
  { symbol: '∫', color: 'bg-emerald-500/20 text-emerald-300', size: 'text-4xl', delay: 0.8, x: 170, y: 340 },
]

const stats = [
  { value: '9+', label: 'Shape Lessons' },
  { value: '50+', label: 'Practice Questions' },
  { value: '2D & 3D', label: 'Simulations' },
  { value: 'AI', label: 'Tutor Support' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="hero-bg relative overflow-hidden pt-16">
        {/* Floating math symbols */}
        <div className="absolute inset-0 pointer-events-none">
          {heroShapes.map((s, i) => (
            <motion.div
              key={i}
              className={`absolute ${s.color} ${s.size} rounded-xl w-14 h-14 flex items-center justify-center font-bold float-shape`}
              style={{ left: `${s.x}px`, top: `${s.y}px` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: s.delay + 0.5, duration: 0.5 }}
            >
              {s.symbol}
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium px-4 py-1.5 rounded-full border border-white/20 mb-6">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                Interactive Geometry Learning
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                  Geometry
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-white/70 font-medium mb-3">
                Learn formulas visually, not by memorizing.
              </p>

              <p className="text-base text-white/60 max-w-xl mb-10 leading-relaxed">
                Instead of just showing <code className="text-cyan-300 bg-white/10 px-1.5 py-0.5 rounded text-sm">A = πr²</code>, we show{' '}
                <em>why</em> it works — through interactive animations, step-by-step derivations, and
                an AI tutor that speaks your language.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/geometry" className="btn-primary bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-blue-900/30 text-base px-7 py-3">
                  <Play className="w-5 h-5 fill-blue-600" />
                  Start Learning
                </Link>
                <Link href="/geometry" className="inline-flex items-center gap-2 text-white/80 border border-white/30 px-7 py-3 rounded-xl hover:bg-white/10 transition-all duration-150 font-semibold text-base">
                  Explore Geometry
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              From Formula to Understanding
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Take the circle area as an example. Instead of memorizing πr², we show you exactly <em>why</em> that's true.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'See the circle cut into sectors',
                desc: 'Like slicing a pizza into many thin pieces.',
                color: 'bg-blue-600',
              },
              {
                step: '2',
                title: 'Watch sectors rearrange',
                desc: 'They fan out and form a rectangle-like shape.',
                color: 'bg-purple-600',
              },
              {
                step: '3',
                title: 'Discover the formula',
                desc: 'Height = r, Base = πr, Area = πr × r = πr²',
                color: 'bg-emerald-600',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.color} text-white text-xl font-extrabold flex items-center justify-center mb-4 shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/geometry/circle" className="btn-primary text-sm px-6 py-2.5">
              Try Circle Simulation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Everything You Need to Understand
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              A complete learning system — simulations, derivations, an AI tutor, quizzes, and progress tracking.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`card-hover ${feature.bg} border ${feature.border}`}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-sm`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SHAPES PREVIEW ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Start with Geometry
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Master 2D and 3D shapes with visual proofs that make formulas unforgettable.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { symbol: '○', name: 'Circle', formula: 'A = πr²', color: 'bg-blue-100 text-blue-700', href: '/geometry/circle' },
              { symbol: '△', name: 'Triangle', formula: 'A = ½bh', color: 'bg-green-100 text-green-700', href: '/geometry/triangle' },
              { symbol: '▱', name: 'Parallelogram', formula: 'A = bh', color: 'bg-amber-100 text-amber-700', href: '/geometry/parallelogram' },
              { symbol: '⬡', name: 'Trapezium', formula: 'A = ½(a+b)h', color: 'bg-purple-100 text-purple-700', href: '/geometry/trapezium' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={s.href} className="card-hover text-center block">
                  <div className={`text-4xl font-bold ${s.color.split(' ')[1]} mb-2`}>{s.symbol}</div>
                  <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">{s.formula}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/geometry" className="btn-secondary">
              View All Shapes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="hero-bg py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to understand, not just memorize?
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
              Start with the Circle Area simulation — the signature feature that shows you exactly why πr² works.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/geometry/circle" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-base">
                <Play className="w-5 h-5 fill-blue-600" />
                Try Circle Simulation
              </Link>
              <Link href="/geometry" className="inline-flex items-center gap-2 text-white border border-white/30 px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all font-semibold text-base">
                Browse All Lessons
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">Geometry</span>
            </div>
            <p className="text-sm">
              Built to help students understand, not just memorize. Phase 1: Geometry.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/geometry" className="hover:text-white transition-colors">Geometry</Link>
              <Link href="/progress" className="hover:text-white transition-colors">Progress</Link>
              <Link href="/ai-tutor" className="hover:text-white transition-colors">AI Tutor</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
