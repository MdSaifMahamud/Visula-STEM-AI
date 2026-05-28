'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, BookOpen } from 'lucide-react'
import Link from 'next/link'
import AITutorPanel from '@/components/ai/AITutorPanel'
import { lessons } from '@/lib/lessons'

export default function AITutorPage() {
  const [selectedLesson, setSelectedLesson] = useState<string>('General Geometry')
  const availableLessons = lessons.filter((l) => l.available)

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">AI Math Tutor</h1>
            <p className="text-sm text-slate-500">Ask anything about geometry formulas</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic selector */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Choose Topic
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedLesson('General Geometry')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                  ${selectedLesson === 'General Geometry' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                🔢 General Geometry
              </button>
              {availableLessons.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLesson(l.title)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2
                    ${selectedLesson === l.title ? 'font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  style={selectedLesson === l.title ? { backgroundColor: `${l.color}12`, color: l.color } : {}}
                >
                  <span>{l.icon}</span>
                  {l.shape}
                </button>
              ))}
            </div>
          </div>

          <div className="card bg-blue-50 border-blue-200">
            <p className="text-xs text-blue-700 font-medium mb-2">💡 Tips</p>
            <ul className="text-xs text-blue-600 space-y-1.5">
              <li>• Ask "Why does this formula work?"</li>
              <li>• Ask for real-life examples</li>
              <li>• Ask in Bangla for Bangla reply</li>
              <li>• Ask for a practice question</li>
            </ul>
          </div>
        </div>

        {/* Chat panel */}
        <div className="lg:col-span-2 card flex flex-col" style={{ height: '600px' }}>
          <AITutorPanel
            lessonContext={selectedLesson}
            shapeName={selectedLesson === 'General Geometry' ? undefined : selectedLesson.replace('Area of ', '').replace('Surface Area & Volume', '').trim()}
            accentColor="#2563EB"
          />
        </div>
      </div>
    </div>
  )
}
