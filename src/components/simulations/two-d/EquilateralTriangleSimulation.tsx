'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

interface Props { accentColor?: string }
type Step = 'triangle' | 'height' | 'formula'

export default function EquilateralTriangleSimulation({ accentColor = '#16a34a' }: Props) {
  const [side, setSide] = useState(120)
  const [step, setStep] = useState<Step>('triangle')

  const W = 320, H = 280
  const cx = W / 2
  const h = (Math.sqrt(3) / 2) * side
  const by = H - 50
  const ty = by - h
  const lx = cx - side / 2
  const rx = cx + side / 2

  const heightVal = h.toFixed(1)
  const area = ((Math.sqrt(3) / 4) * side * side).toFixed(1)

  const reset = () => setStep('triangle')

  return (
    <div className="space-y-4">
      <div className="sim-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas" style={{ maxHeight: '280px' }}>
          <defs>
            <pattern id="equigrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#equigrid)" />

          {/* Triangle */}
          <polygon points={`${lx},${by} ${rx},${by} ${cx},${ty}`}
            fill={accentColor} opacity={0.82} stroke="white" strokeWidth="2" />

          {/* Side labels */}
          <text x={(lx + cx) / 2 - 16} y={(by + ty) / 2} fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">a={side}</text>
          <text x={(rx + cx) / 2 + 16} y={(by + ty) / 2} fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">a={side}</text>
          <text x={cx} y={by + 16} fontSize="10" fill="#0F172A" textAnchor="middle" fontWeight="bold">a={side}</text>
          <text x={cx} y={ty - 8} fontSize="10" fill="#0F172A" textAnchor="middle">60°+60°+60°</text>

          <AnimatePresence>
            {step !== 'triangle' && (
              <motion.g key="height" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Height dashed line */}
                <line x1={cx} y1={ty} x2={cx} y2={by} stroke="#DC2626" strokeWidth="2" strokeDasharray="5 3" />
                {/* Right angle box */}
                <rect x={cx + 1} y={by - 10} width="9" height="9" fill="none" stroke="#DC2626" strokeWidth="1.5" />
                {/* Height label */}
                <rect x={cx + 14} y={(ty + by) / 2 - 10} width="80" height="20" rx="4" fill="white" opacity="0.9" />
                <text x={cx + 54} y={(ty + by) / 2 + 4} fontSize="10" fill="#DC2626" textAnchor="middle" fontWeight="bold">
                  h = (√3/2)a = {heightVal}
                </text>
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step === 'formula' && (
              <motion.g key="formula" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={(W - 230) / 2} y={H - 30} width="230" height="22" rx="6" fill={accentColor} opacity="0.95" />
                <text x={W / 2} y={H - 14} fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">
                  A = ½×{side}×{heightVal} = (√3/4)×{side}² ≈ {area} units²
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Slider */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-xs font-medium text-slate-600">Side length (a)</label>
          <span className="text-xs font-bold" style={{ color: accentColor }}>{side} units</span>
        </div>
        <input type="range" min={60} max={170} value={side}
          onChange={e => { setSide(Number(e.target.value)); reset() }}
          className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={() => setStep('height')} disabled={step !== 'triangle'}
          className="flex-1 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
          📐 Show Height
        </button>
        <button onClick={() => setStep('formula')} disabled={step !== 'height'}
          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 disabled:opacity-40 transition-all">
          📋 Derive Formula
        </button>
        <button onClick={reset} disabled={step === 'triangle'}
          className="px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-100 disabled:opacity-40 transition-all">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        {step === 'triangle' && 'All 3 sides are equal (a). All angles are 60°. Click "Show Height" to draw the perpendicular height.'}
        {step === 'height' && `The height h = (√3/2)×a = ${heightVal} units. It bisects the base into two halves of ${(side / 2).toFixed(1)} each. Now derive the area!`}
        {step === 'formula' && <>A = ½×base×height = ½×{side}×{heightVal} = <strong>(√3/4)×a² ≈ {area} units²</strong>. This is the special equilateral triangle formula!</>}
      </div>

      <div className="formula-box text-sm">
        A = (√3/4)a² = (√3/4) × {side}² ≈ {area} units²
      </div>
    </div>
  )
}
