'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Square, RotateCcw } from 'lucide-react'

interface Props { accentColor?: string }

type AnimState = 'original' | 'duplicate' | 'parallelogram'

export default function TriangleSimulation({ accentColor = '#059669' }: Props) {
  const [base, setBase] = useState(160)
  const [height, setHeight] = useState(100)
  const [animState, setAnimState] = useState<AnimState>('original')
  const [showFormula, setShowFormula] = useState(true)

  const W = 320, H = 280
  const margin = 30

  // Triangle 1 vertices (bottom-left based)
  const t1 = {
    bx: margin,
    by: H - 60,
    tx: margin + 60,  // apex (slightly offset for non-right triangle)
    ty: H - 60 - height,
    rx: margin + base,
    ry: H - 60,
  }

  // Parallelogram: triangle 2 is flipped and attached to triangle 1
  // The flipped triangle shares the hypotenuse with t1
  const t2Flip = {
    bx: t1.rx,
    by: t1.by,
    tx: t1.rx + (t1.rx - t1.tx),
    ty: t1.ty,
    rx: t1.rx + base,
    ry: t1.ry,
  }

  // Duplicate shown above original
  const t2Dup = {
    bx: margin,
    by: H - 160,
    tx: margin + 60,
    ty: H - 160 - height,
    rx: margin + base,
    ry: H - 160,
  }

  const area = 0.5 * base * height
  const paraArea = base * height

  const renderTriangle = (t: typeof t1, color: string, opacity: number, key: string) => (
    <motion.polygon
      key={key}
      points={`${t.bx},${t.by} ${t.tx},${t.ty} ${t.rx},${t.ry}`}
      fill={color}
      opacity={opacity}
      stroke="white"
      strokeWidth="2"
    />
  )

  return (
    <div className="space-y-4">
      <div className="sim-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas" style={{ maxHeight: '280px' }}>
          <defs>
            <pattern id="tgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#tgrid)" />

          <AnimatePresence mode="wait">
            {animState === 'original' && (
              <motion.g key="orig" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {renderTriangle(t1, accentColor, 0.8, 't1-orig')}
                {/* Height line */}
                <line x1={t1.tx} y1={t1.ty} x2={t1.tx} y2={t1.by} stroke="#0F172A" strokeWidth="1.5" strokeDasharray="4 2" />
                {showFormula && (
                  <>
                    <text x={t1.bx + base / 2} y={t1.by + 16} fontSize="12" fill="#0F172A" textAnchor="middle" fontWeight="bold">b = {base}</text>
                    <text x={t1.tx - 22} y={t1.ty + height / 2} fontSize="12" fill="#0F172A" textAnchor="middle" fontWeight="bold">h = {height}</text>
                  </>
                )}
              </motion.g>
            )}

            {animState === 'duplicate' && (
              <motion.g key="dup" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {renderTriangle(t1, accentColor, 0.8, 't1-dup')}
                {renderTriangle(t2Dup, '#DC2626', 0.8, 't2-dup')}
                <text x={W / 2} y={20} fontSize="11" fill="#64748b" textAnchor="middle">Two identical triangles</text>
              </motion.g>
            )}

            {animState === 'parallelogram' && (
              <motion.g key="para" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {renderTriangle(t1, accentColor, 0.8, 't1-para')}
                {renderTriangle(t2Flip, '#DC2626', 0.8, 't2-para')}
                {/* Height line */}
                <line x1={t1.tx} y1={t1.ty} x2={t1.tx} y2={t1.by} stroke="#0F172A" strokeWidth="1.5" strokeDasharray="4 2" />
                {showFormula && (
                  <>
                    <text x={t1.bx + base / 2} y={t1.by + 16} fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="bold">base = {base}</text>
                    <text x={t1.tx - 20} y={t1.ty + height / 2} fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="bold">h = {height}</text>
                    <rect x={(W - 200) / 2} y={H - 30} width="200" height="22" rx="6" fill={accentColor} opacity="0.9" />
                    <text x={W / 2} y={H - 15} fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">
                      A_parallelogram = {base} × {height} = {paraArea}
                    </text>
                  </>
                )}
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium text-slate-600">Base (b)</label>
            <span className="text-xs font-bold" style={{ color: accentColor }}>{base} units</span>
          </div>
          <input type="range" min={80} max={240} value={base}
            onChange={(e) => { setBase(Number(e.target.value)); setAnimState('original') }}
            className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium text-slate-600">Height (h)</label>
            <span className="text-xs font-bold" style={{ color: accentColor }}>{height} units</span>
          </div>
          <input type="range" min={40} max={160} value={height}
            onChange={(e) => { setHeight(Number(e.target.value)); setAnimState('original') }}
            className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={() => setAnimState('duplicate')} disabled={animState !== 'original'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
          <Copy className="w-3.5 h-3.5" /> Duplicate Triangle
        </button>
        <button onClick={() => setAnimState('parallelogram')} disabled={animState !== 'duplicate'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 disabled:opacity-40 transition-all">
          <Square className="w-3.5 h-3.5" /> Form Parallelogram
        </button>
        <button onClick={() => setAnimState('original')} disabled={animState === 'original'}
          className="px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-all">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Explanation */}
      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        {animState === 'original' && '👆 Press "Duplicate Triangle" to create a copy.'}
        {animState === 'duplicate' && '✅ Two identical triangles! Now press "Form Parallelogram" to join them.'}
        {animState === 'parallelogram' && <>🔷 Two triangles form one parallelogram! Parallelogram area = b×h = {base}×{height} = {paraArea}. So <strong>one triangle = {paraArea}/2 = {area}</strong>. A = ½ × {base} × {height} = {area}</>}
      </div>

      {showFormula && (
        <div className="formula-box text-sm">
          A = ½ × b × h = ½ × {base} × {height} = {area} units²
        </div>
      )}
    </div>
  )
}
