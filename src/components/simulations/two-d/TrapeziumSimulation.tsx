'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'

interface Props { accentColor?: string }
type AnimState = 'original' | 'duplicate' | 'parallelogram'

export default function TrapeziumSimulation({ accentColor = '#7C3AED' }: Props) {
  const [topBase, setTopBase] = useState(100)
  const [bottomBase, setBottomBase] = useState(160)
  const [height, setHeight] = useState(90)
  const [animState, setAnimState] = useState<AnimState>('original')
  const [showFormula, setShowFormula] = useState(true)

  const W = 320, H = 280
  const by = H - 60
  const bx = 40

  const offset = (bottomBase - topBase) / 2

  // Trapezium vertices
  const T1 = {
    bl: { x: bx, y: by },
    br: { x: bx + bottomBase, y: by },
    tr: { x: bx + offset + topBase, y: by - height },
    tl: { x: bx + offset, y: by - height },
  }

  // Flipped duplicate (rotated 180°) joined to right of T1 to form parallelogram
  const T2 = {
    bl: { x: T1.br.x, y: T1.bl.y},
    br: { x: T1.br.x + bottomBase, y: T1.bl.y},
    tr: { x: T1.tr.x + bottomBase - topBase, y: T1.tr.y },
    tl: { x: T1.tr.x, y: T1.tr.y },
  }

  // Duplicate shown above T1 (not yet joined)
  const T2Dup = {
    bl: { x: bx, y: by - height - 20 },
    br: { x: bx + bottomBase, y: by - height - 20 },
    tr: { x: bx + offset + topBase, y: by - height - 20 - height },
    tl: { x: bx + offset, y: by - height - 20 - height },
  }

  const area = 0.5 * (topBase + bottomBase) * height
  const paraBase = topBase + bottomBase

  const trapPoints = (t: typeof T1) =>
    `${t.bl.x},${t.bl.y} ${t.br.x},${t.br.y} ${t.tr.x},${t.tr.y} ${t.tl.x},${t.tl.y}`

  return (
    <div className="space-y-4">
      <div className="sim-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas" style={{ maxHeight: '280px' }}>
          <defs>
            <pattern id="trapgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#trapgrid)" />

          <AnimatePresence mode="wait">
            {animState === 'original' && (
              <motion.g key="orig" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <polygon points={trapPoints(T1)} fill={accentColor} opacity={0.8} stroke="white" strokeWidth="2" />
                <line x1={T1.tl.x} y1={T1.tl.y} x2={T1.tl.x} y2={T1.bl.y} stroke="#0F172A" strokeWidth="1.5" strokeDasharray="4 2" />
                {showFormula && (
                  <>
                    <text x={T1.tl.x + topBase / 2} y={T1.tl.y - 8} fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="bold">a = {topBase}</text>
                    <text x={T1.bl.x + bottomBase / 2} y={T1.bl.y + 16} fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="bold">b = {bottomBase}</text>
                    <text x={T1.tl.x - 16} y={T1.tl.y + height / 2} fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="bold">h = {height}</text>
                  </>
                )}
              </motion.g>
            )}

            {animState === 'duplicate' && (
              <motion.g key="dup" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <polygon points={trapPoints(T1)} fill={accentColor} opacity={0.8} stroke="white" strokeWidth="2" />
                <polygon points={trapPoints(T2Dup)} fill="#DC2626" opacity={0.8} stroke="white" strokeWidth="2" />
                <text x={W / 2} y={12} fontSize="11" fill="#64748b" textAnchor="middle">Flipped copy — ready to join!</text>
              </motion.g>
            )}

            {animState === 'parallelogram' && (
              <motion.g key="para" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <polygon points={trapPoints(T1)} fill={accentColor} opacity={0.8} stroke="white" strokeWidth="2" />
                <polygon points={trapPoints(T2)} fill="#DC2626" opacity={0.8} stroke="white" strokeWidth="2" />
                <line x1={T1.tl.x} y1={T1.tl.y} x2={T1.tl.x} y2={T1.bl.y} stroke="#0F172A" strokeWidth="1.5" strokeDasharray="4 2" />
                {showFormula && (
                  <>
                    <text x={T1.bl.x + (T2.br.x - T1.bl.x) / 2} y={T1.bl.y + 16} fontSize="10" fill="#0F172A" textAnchor="middle" fontWeight="bold">
                      base = a+b = {paraBase}
                    </text>
                    <text x={T1.tl.x - 16} y={T1.tl.y + height / 2} fontSize="10" fill="#0F172A" textAnchor="middle" fontWeight="bold">h</text>
                    <rect x={(W - 200) / 2} y={H - 26} width="200" height="20" rx="6" fill={accentColor} opacity="0.9" />
                    <text x={W / 2} y={H - 11} fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">
                      2 traps → para: ({topBase}+{bottomBase})×{height}={paraBase * height}
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
        {[
          { label: 'Top base (a)', value: topBase, min: 30, max: 180, setter: (v: number) => { setTopBase(v); setAnimState('original') } },
          { label: 'Bottom base (b)', value: bottomBase, min: 60, max: 220, setter: (v: number) => { setBottomBase(v); setAnimState('original') } },
          { label: 'Height (h)', value: height, min: 40, max: 150, setter: (v: number) => { setHeight(v); setAnimState('original') } },
        ].map(({ label, value, min, max, setter }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-slate-600">{label}</label>
              <span className="text-xs font-bold" style={{ color: accentColor }}>{value} units</span>
            </div>
            <input type="range" min={min} max={max} value={value}
              onChange={(e) => setter(Number(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={() => setAnimState('duplicate')} disabled={animState !== 'original'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
          <Copy className="w-3.5 h-3.5" /> Duplicate & Flip
        </button>
        <button onClick={() => setAnimState('parallelogram')} disabled={animState !== 'duplicate'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 disabled:opacity-40 transition-all">
          🔗 Join Together
        </button>
        <button onClick={() => setAnimState('original')} disabled={animState === 'original'}
          className="px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-all">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        {animState === 'original' && `👆 Press "Duplicate & Flip" to create a rotated copy of the trapezium.`}
        {animState === 'duplicate' && '🔄 Flipped copy ready! Press "Join Together" to form a parallelogram.'}
        {animState === 'parallelogram' && (
          <>🔷 Two trapeziums form a parallelogram with base = (a+b) = {paraBase} and h = {height}. Parallelogram area = {paraBase}×{height} = {paraBase * height}. So <strong>1 trapezium = {paraBase * height}/2 = {area}</strong>. A = ½({topBase}+{bottomBase})×{height}</>
        )}
      </div>

      {showFormula && (
        <div className="formula-box text-sm">
          A = ½(a+b)×h = ½({topBase}+{bottomBase})×{height} = {area} units²
        </div>
      )}
    </div>
  )
}
