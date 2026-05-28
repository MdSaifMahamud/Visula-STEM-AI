'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

interface Props { accentColor?: string }
type AnimState = 'original' | 'cut' | 'rectangle'

export default function ParallelogramSimulation({ accentColor = '#D97706' }: Props) {
  const [base, setBase] = useState(160)
  const [height, setHeight] = useState(90)
  const [slant, setSlant] = useState(30)
  const [animState, setAnimState] = useState<AnimState>('original')
  const [showFormula, setShowFormula] = useState(true)

  const W = 320, H = 280
  const by = H - 60
  const bx = 50
  const offset = Math.tan((slant * Math.PI) / 180) * height

  // Parallelogram vertices
  const P = {
    bl: { x: bx, y: by },
    br: { x: bx + base, y: by },
    tr: { x: bx + base + offset, y: by - height },
    tl: { x: bx + offset, y: by - height },
  }

  // Triangle cut from left: bl, P.tl, (P.tl.x, P.bl.y) = the left triangle
  const triLeft = `${P.bl.x},${P.bl.y} ${P.tl.x},${P.tl.y} ${P.tl.x},${P.bl.y}`
  // Remaining trapezoid becomes rect when triangle moved right
  const rectPoints = `${P.tl.x},${P.bl.y} ${P.bl.x + base},${P.bl.y} ${P.bl.x + base},${P.tl.y} ${P.tl.x},${P.tl.y}`

  // In 'rectangle' state: cut triangle moved to right side
  const triRight = `${P.bl.x + base},${P.bl.y} ${P.bl.x + base + offset},${P.bl.y} ${P.bl.x + base + offset},${P.tl.y}`
  const rectFinalPoints = `${P.tl.x},${P.tl.y} ${P.bl.x + base},${P.tl.y} ${P.bl.x + base},${P.bl.y} ${P.tl.x},${P.bl.y}`

  const area = base * height

  return (
    <div className="space-y-4">
      <div className="sim-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas" style={{ maxHeight: '280px' }}>
          <defs>
            <pattern id="pgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#pgrid)" />

          <AnimatePresence mode="wait">
            {animState === 'original' && (
              <motion.g key="orig" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.polygon
                  points={`${P.bl.x},${P.bl.y} ${P.br.x},${P.br.y} ${P.tr.x},${P.tr.y} ${P.tl.x},${P.tl.y}`}
                  fill={accentColor} opacity={0.75} stroke="white" strokeWidth="2"
                />
                {/* Height dashed line */}
                <line x1={P.tl.x} y1={P.tl.y} x2={P.tl.x} y2={P.bl.y} stroke="#0F172A" strokeWidth="1.5" strokeDasharray="4 2" />
                {/* Slant side */}
                <line x1={P.bl.x} y1={P.bl.y} x2={P.tl.x} y2={P.tl.y} stroke="#DC2626" strokeWidth="2" opacity={0.6} />
                {showFormula && (
                  <>
                    <text x={P.bl.x + base / 2} y={by + 16} fontSize="12" fill="#0F172A" textAnchor="middle" fontWeight="bold">b = {base}</text>
                    <text x={P.tl.x - 18} y={by - height / 2} fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="bold">h = {height}</text>
                  </>
                )}
              </motion.g>
            )}

            {animState === 'cut' && (
              <motion.g key="cut" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Main body minus left triangle */}
                <polygon points={`${P.tl.x},${P.tl.y} ${P.tr.x},${P.tr.y} ${P.br.x},${P.br.y} ${P.tl.x},${P.bl.y}`}
                  fill={accentColor} opacity={0.75} stroke="white" strokeWidth="2" />
                {/* Cut triangle - separated slightly */}
                <polygon points={triLeft} fill="#DC2626" opacity={0.8} stroke="white" strokeWidth="2"
                  transform={`translate(-6, 0)`} />
                <text x={W / 2} y={20} fontSize="11" fill="#64748b" textAnchor="middle">Triangle cut from left side</text>
              </motion.g>
            )}

            {animState === 'rectangle' && (
              <motion.g key="rect" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Rectangle (main body) */}
                <polygon points={rectFinalPoints} fill={accentColor} opacity={0.75} stroke="white" strokeWidth="2" />
                {/* Triangle moved to right */}
                <polygon points={triRight} fill="#DC2626" opacity={0.8} stroke="white" strokeWidth="2" />
                {/* Height and base labels */}
                <line x1={P.tl.x} y1={P.tl.y} x2={P.tl.x} y2={P.bl.y} stroke="#0F172A" strokeWidth="1.5" strokeDasharray="4 2" />
                {showFormula && (
                  <>
                    <text x={P.tl.x + base / 2} y={by + 16} fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="bold">base = {base}</text>
                    <text x={P.tl.x - 16} y={by - height / 2} fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="bold">h = {height}</text>
                    <rect x={(W - 180) / 2} y={H - 26} width="180" height="20" rx="6" fill={accentColor} opacity="0.9" />
                    <text x={W / 2} y={H - 11} fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">A = {base} × {height} = {area}</text>
                  </>
                )}
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        {[
          { label: 'Base (b)', value: base, min: 80, max: 220, setter: (v: number) => { setBase(v); setAnimState('original') } },
          { label: 'Height (h)', value: height, min: 40, max: 160, setter: (v: number) => { setHeight(v); setAnimState('original') } },
          { label: 'Slant angle', value: slant, min: 10, max: 50, setter: (v: number) => { setSlant(v); setAnimState('original') } },
        ].map(({ label, value, min, max, setter }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-slate-600">{label}</label>
              <span className="text-xs font-bold" style={{ color: accentColor }}>{value}{label.includes('angle') ? '°' : ' units'}</span>
            </div>
            <input type="range" min={min} max={max} value={value}
              onChange={(e) => setter(Number(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={() => setAnimState('cut')} disabled={animState !== 'original'}
          className="flex-1 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
          ✂️ Cut Triangle
        </button>
        <button onClick={() => setAnimState('rectangle')} disabled={animState !== 'cut'}
          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 disabled:opacity-40 transition-all">
          ➡️ Move to Rectangle
        </button>
        <button onClick={() => setAnimState('original')} disabled={animState === 'original'}
          className="px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-all">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        {animState === 'original' && '👆 Press "Cut Triangle" to cut the left triangle. Height is the perpendicular distance, NOT the slant side!'}
        {animState === 'cut' && '✂️ Triangle cut! Move it to the right side to form a rectangle.'}
        {animState === 'rectangle' && <>🔷 It\'s a rectangle with base = {base} and height = {height}. We only moved pieces — area stays the same. <strong>A = b × h = {area}</strong></>}
      </div>

      {showFormula && (
        <div className="formula-box text-sm">
          A = b × h = {base} × {height} = {area} units²
        </div>
      )}
    </div>
  )
}
