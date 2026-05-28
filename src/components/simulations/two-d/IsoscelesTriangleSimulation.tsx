'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

interface Props { accentColor?: string }
type Step = 'triangle' | 'axis' | 'height' | 'formula'

export default function IsoscelesTriangleSimulation({ accentColor = '#0d9488' }: Props) {
  const [base, setBase] = useState(140)
  const [leg, setLeg] = useState(110)
  const [step, setStep] = useState<Step>('triangle')

  // Clamp leg to be valid: leg > base/2
  const safeLeg = Math.max(leg, base / 2 + 5)
  const h = Math.sqrt(safeLeg * safeLeg - (base / 2) * (base / 2))

  const W = 320, H = 280
  const cx = W / 2
  const by = H - 50
  const ty = by - h
  const lx = cx - base / 2
  const rx = cx + base / 2

  const hVal = h.toFixed(1)
  const area = (0.5 * base * h).toFixed(1)

  const reset = () => setStep('triangle')

  const steps: Step[] = ['triangle', 'axis', 'height', 'formula']
  const nextStep = () => {
    const idx = steps.indexOf(step)
    if (idx < steps.length - 1) setStep(steps[idx + 1])
  }

  return (
    <div className="space-y-4">
      <div className="sim-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas" style={{ maxHeight: '280px' }}>
          <defs>
            <pattern id="isogrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#isogrid)" />

          {/* Triangle */}
          <polygon points={`${lx},${by} ${rx},${by} ${cx},${ty}`}
            fill={accentColor} opacity={0.82} stroke="white" strokeWidth="2" />

          {/* Base label */}
          <text x={cx} y={by + 16} fontSize="10" fill="#0F172A" textAnchor="middle" fontWeight="bold">b = {base}</text>
          {/* Leg labels */}
          <text x={(lx + cx) / 2 - 12} y={(by + ty) / 2 + 4} fontSize="10" fill="white" fontWeight="bold">l={safeLeg}</text>
          <text x={(rx + cx) / 2 + 12} y={(by + ty) / 2 + 4} fontSize="10" fill="white" fontWeight="bold">l={safeLeg}</text>

          {/* Axis of symmetry */}
          <AnimatePresence>
            {(step === 'axis' || step === 'height' || step === 'formula') && (
              <motion.g key="axis" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={cx} y1={ty - 10} x2={cx} y2={by + 25}
                  stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6 3" />
                <text x={cx + 6} y={ty - 14} fontSize="9" fill="#F59E0B" fontWeight="bold">axis of symmetry</text>
                {/* Half-base labels */}
                <text x={cx - base / 4} y={by + 26} fontSize="9" fill="#F59E0B" textAnchor="middle">b/2={base / 2}</text>
                <text x={cx + base / 4} y={by + 26} fontSize="9" fill="#F59E0B" textAnchor="middle">b/2={base / 2}</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Height line */}
          <AnimatePresence>
            {(step === 'height' || step === 'formula') && (
              <motion.g key="hline" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={cx} y1={ty} x2={cx} y2={by} stroke="#DC2626" strokeWidth="2.5" />
                <rect x={cx + 1} y={by - 10} width="9" height="9" fill="none" stroke="#DC2626" strokeWidth="1.5" />
                <rect x={2} y={(ty + by) / 2 - 10} width="100" height="20" rx="4" fill="white" opacity="0.9" />
                <text x={52} y={(ty + by) / 2 + 4} fontSize="9.5" fill="#DC2626" textAnchor="middle" fontWeight="bold">
                  h = √(l²-(b/2)²) = {hVal}
                </text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Formula bar */}
          <AnimatePresence>
            {step === 'formula' && (
              <motion.g key="fbar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={(W - 220) / 2} y={H - 30} width="220" height="22" rx="6" fill={accentColor} opacity="0.95" />
                <text x={W / 2} y={H - 14} fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">
                  A = ½×{base}×{hVal} = {area} units²
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Sliders */}
      <div className="space-y-2">
        {[
          { label: 'Base (b)', value: base, min: 60, max: 200, set: (v: number) => { setBase(v); reset() } },
          { label: `Equal legs (l) — must be > b/2 = ${(base / 2).toFixed(0)}`, value: leg, min: Math.ceil(base / 2) + 5, max: 160, set: (v: number) => { setLeg(v); reset() } },
        ].map(({ label, value, min, max, set }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-slate-600">{label}</label>
              <span className="text-xs font-bold" style={{ color: accentColor }}>{value}</span>
            </div>
            <input type="range" min={min} max={max} value={value}
              onChange={e => set(Number(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
          </div>
        ))}
      </div>

      {/* Step buttons */}
      <div className="flex gap-2">
        <button onClick={nextStep} disabled={step === 'formula'}
          className="flex-1 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all text-white"
          style={{ backgroundColor: accentColor }}>
          {step === 'triangle' && '🔶 Show Symmetry Axis'}
          {step === 'axis' && '📏 Show Height'}
          {step === 'height' && '📋 Derive Formula'}
          {step === 'formula' && '✅ Done'}
        </button>
        <button onClick={reset} disabled={step === 'triangle'}
          className="px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-100 disabled:opacity-40">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        {step === 'triangle' && 'Two legs are equal (l). The base is b. Step through to find the height using the axis of symmetry.'}
        {step === 'axis' && `The axis of symmetry bisects the base into two halves of ${base / 2}. It meets the base at a right angle.`}
        {step === 'height' && `Using Pythagoras in the right triangle: h = √(l² - (b/2)²) = √(${safeLeg}² - ${base / 2}²) = ${hVal} units.`}
        {step === 'formula' && <>A = ½ × b × h = ½ × {base} × {hVal} = <strong>{area} units²</strong>. Same as A = ½bh for any triangle!</>}
      </div>

      <div className="formula-box text-sm">
        A = ½bh = ½ × {base} × {hVal} = {area} units²
      </div>
    </div>
  )
}
