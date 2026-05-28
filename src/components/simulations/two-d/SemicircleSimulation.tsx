'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

interface Props { accentColor?: string }
type Step = 'full' | 'cut' | 'label'

export default function SemicircleSimulation({ accentColor = '#0284C7' }: Props) {
  const [radius, setRadius] = useState(80)
  const [step, setStep] = useState<Step>('full')

  const W = 320, H = 260
  const cx = W / 2, cy = H / 2 + 20

  const area = (0.5 * Math.PI * radius * radius).toFixed(1)
  const perimeter = (Math.PI * radius + 2 * radius).toFixed(1)

  const reset = () => setStep('full')

  // Full circle arc path
  const fullPath = `M ${cx - radius},${cy} A ${radius},${radius} 0 1 1 ${cx + radius},${cy} Z`
  // Semicircle path (top half)
  const semiPath = `M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy} Z`

  return (
    <div className="space-y-4">
      <div className="sim-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas" style={{ maxHeight: '260px' }}>
          <defs>
            <pattern id="semigrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#semigrid)" />

          <AnimatePresence mode="wait">
            {step === 'full' && (
              <motion.g key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <path d={fullPath} fill={accentColor} opacity={0.7} stroke="white" strokeWidth="2" />
                <text x={cx} y={cy - radius / 2} fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">
                  Full Circle
                </text>
                <text x={cx + 6} y={cy + 14} fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">
                  A = πr²
                </text>
                {/* Radius line */}
                <line x1={cx} y1={cy} x2={cx + radius} y2={cy} stroke="white" strokeWidth="1.5" strokeDasharray="4 2" />
                <text x={cx + radius / 2} y={cy - 6} fontSize="10" fill="white" textAnchor="middle">r={radius}</text>
              </motion.g>
            )}

            {step === 'cut' && (
              <motion.g key="cut" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Bottom half (faded) */}
                <path d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 0 ${cx + radius},${cy} Z`}
                  fill={accentColor} opacity={0.2} stroke={accentColor} strokeWidth="1.5" strokeDasharray="6 3" />
                {/* Top half (solid) */}
                <path d={semiPath} fill={accentColor} opacity={0.82} stroke="white" strokeWidth="2" />
                {/* Diameter line */}
                <line x1={cx - radius} y1={cy} x2={cx + radius} y2={cy}
                  stroke="#DC2626" strokeWidth="2.5" />
                <text x={cx} y={cy + 16} fontSize="10" fill="#DC2626" textAnchor="middle" fontWeight="bold">
                  diameter = 2r = {2 * radius}
                </text>
                <text x={cx} y={cy - radius / 3} fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">
                  ½ of circle
                </text>
              </motion.g>
            )}

            {step === 'label' && (
              <motion.g key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <path d={semiPath} fill={accentColor} opacity={0.82} stroke="white" strokeWidth="2" />
                <line x1={cx - radius} y1={cy} x2={cx + radius} y2={cy} stroke="#DC2626" strokeWidth="2.5" />
                {/* Radius line */}
                <line x1={cx} y1={cy} x2={cx} y2={cy - radius} stroke="white" strokeWidth="1.5" strokeDasharray="4 2" />
                <text x={cx + 14} y={cy - radius / 2} fontSize="10" fill="white" fontWeight="bold">r={radius}</text>
                {/* Arc label */}
                <text x={cx + radius + 8} y={cy - radius / 2} fontSize="9" fill="#0F172A">arc = πr</text>
                {/* Formula labels */}
                <rect x={(W - 210) / 2} y={H - 52} width="210" height="44" rx="8" fill="white" opacity="0.95" stroke="#e2e8f0" strokeWidth="1" />
                <text x={W / 2} y={H - 35} fontSize="10" fill="#0F172A" textAnchor="middle" fontWeight="bold">
                  A = ½πr² = ½×π×{radius}² ≈ {area} units²
                </text>
                <text x={W / 2} y={H - 18} fontSize="10" fill="#64748b" textAnchor="middle">
                  Perimeter = πr + 2r = {perimeter} units
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <label className="text-xs font-medium text-slate-600">Radius (r)</label>
          <span className="text-xs font-bold" style={{ color: accentColor }}>{radius} units</span>
        </div>
        <input type="range" min={40} max={110} value={radius}
          onChange={e => { setRadius(Number(e.target.value)); reset() }}
          className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setStep('cut')} disabled={step !== 'full'}
          className="flex-1 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
          ✂️ Cut in Half
        </button>
        <button onClick={() => setStep('label')} disabled={step !== 'cut'}
          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 disabled:opacity-40 transition-all">
          📋 Show Formula
        </button>
        <button onClick={reset} disabled={step === 'full'}
          className="px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-100 disabled:opacity-40">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        {step === 'full' && 'A full circle with radius r has area πr². A semicircle is exactly half of this.'}
        {step === 'cut' && `Diameter = 2r = ${2 * radius} cuts the circle exactly in half. Each half is a semicircle with area = ½ × πr².`}
        {step === 'label' && <>A = ½πr² = ½ × π × {radius}² ≈ <strong>{area} units²</strong>. The curved arc = πr, diameter = 2r, so perimeter = πr + 2r = {perimeter}.</>}
      </div>

      <div className="formula-box text-sm">A = ½πr² = ½ × π × {radius}² ≈ {area} units²</div>
    </div>
  )
}
