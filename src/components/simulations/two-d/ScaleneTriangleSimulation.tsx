'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

interface Props { accentColor?: string }
type Step = 'triangle' | 'sides' | 'heron' | 'verify'

export default function ScaleneTriangleSimulation({ accentColor = '#0891b2' }: Props) {
  const [base, setBase] = useState(160)
  const [height, setHeight] = useState(90)
  const [offset, setOffset] = useState(50)   // apex x offset from left end of base
  const [step, setStep] = useState<Step>('triangle')

  const W = 320, H = 280
  const bx = 30
  const by = H - 50
  const ax = bx + offset          // apex x
  const ay = by - height           // apex y
  const rx = bx + base             // right base x

  // Three side lengths
  const sideA = Math.sqrt((ax - rx) * (ax - rx) + height * height).toFixed(1)
  const sideB = Math.sqrt((ax - bx) * (ax - bx) + height * height).toFixed(1)
  const sideC = base.toFixed(1)

  const a = parseFloat(sideA), b = parseFloat(sideB), c = parseFloat(sideC)
  const s = (a + b + c) / 2
  const heronArea = Math.sqrt(s * (s - a) * (s - b) * (s - c)).toFixed(1)
  const halfBHArea = (0.5 * base * height).toFixed(1)

  const reset = () => setStep('triangle')

  return (
    <div className="space-y-4">
      <div className="sim-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas" style={{ maxHeight: '280px' }}>
          <defs>
            <pattern id="scalgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#scalgrid)" />

          {/* Triangle */}
          <polygon points={`${bx},${by} ${rx},${by} ${ax},${ay}`}
            fill={accentColor} opacity={0.82} stroke="white" strokeWidth="2" />

          {/* Side labels when sides step */}
          <AnimatePresence>
            {(step === 'sides' || step === 'heron' || step === 'verify') && (
              <motion.g key="side-labels" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Side c (base) */}
                <text x={(bx + rx) / 2} y={by + 16} fontSize="10" fill="#0F172A" textAnchor="middle" fontWeight="bold">c={sideC}</text>
                {/* Side b (left) */}
                <text x={(bx + ax) / 2 - 18} y={(by + ay) / 2} fontSize="10" fill="white" fontWeight="bold">b={sideB}</text>
                {/* Side a (right) */}
                <text x={(rx + ax) / 2 + 14} y={(by + ay) / 2} fontSize="10" fill="white" fontWeight="bold">a={sideA}</text>
                <text x={ax} y={ay - 8} fontSize="9" fill="#64748b" textAnchor="middle">All sides different!</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Height line */}
          <AnimatePresence>
            {(step === 'verify') && (
              <motion.g key="hline" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={ax} y1={ay} x2={ax} y2={by} stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 3" />
                <rect x={ax + 1} y={by - 10} width="9" height="9" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                <text x={ax + 14} y={(ay + by) / 2} fontSize="10" fill="#F59E0B" fontWeight="bold">h={height}</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Heron info box */}
          <AnimatePresence>
            {step === 'heron' && (
              <motion.g key="heron" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={4} y={4} width="200" height="52" rx="6" fill="white" opacity="0.95" stroke="#e2e8f0" strokeWidth="1" />
                <text x={10} y={18} fontSize="9" fill="#475569" fontWeight="bold">Heron's Formula:</text>
                <text x={10} y={31} fontSize="9" fill="#475569">s = (a+b+c)/2 = {s.toFixed(1)}</text>
                <text x={10} y={44} fontSize="9" fill={accentColor} fontWeight="bold">A = √(s(s-a)(s-b)(s-c)) = {heronArea}</text>
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step === 'verify' && (
              <motion.g key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={(W - 230) / 2} y={H - 30} width="230" height="22" rx="6" fill={accentColor} opacity="0.95" />
                <text x={W / 2} y={H - 14} fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">
                  ½bh={halfBHArea} ≈ Heron={heronArea} ✓ Both match!
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Sliders */}
      <div className="space-y-2">
        {[
          { label: 'Base length', value: base, min: 80, max: 220, set: (v: number) => { setBase(v); reset() } },
          { label: 'Height', value: height, min: 40, max: 150, set: (v: number) => { setHeight(v); reset() } },
          { label: 'Apex position (offset)', value: offset, min: 10, max: base - 10, set: (v: number) => { setOffset(v); reset() } },
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

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={() => setStep('sides')} disabled={step !== 'triangle'}
          className="flex-1 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
          📐 Show Sides
        </button>
        <button onClick={() => setStep('heron')} disabled={step !== 'sides'}
          className="flex-1 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all bg-amber-50 text-amber-700">
          🏛️ Heron's Formula
        </button>
        <button onClick={() => setStep('verify')} disabled={step !== 'heron'}
          className="flex-1 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all bg-emerald-50 text-emerald-700">
          ✓ Verify ½bh
        </button>
        <button onClick={reset} disabled={step === 'triangle'}
          className="px-2 py-2 rounded-xl text-slate-400 hover:bg-slate-100 disabled:opacity-40">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        {step === 'triangle' && 'Move the apex offset slider to make all three sides different. This is a scalene triangle — no equal sides!'}
        {step === 'sides' && `Sides: a=${sideA}, b=${sideB}, c=${sideC}. All different! Move offset to change the shape.`}
        {step === 'heron' && `s = ${s.toFixed(1)}. Area by Heron = √(${s.toFixed(1)}×${(s - a).toFixed(1)}×${(s - b).toFixed(1)}×${(s - c).toFixed(1)}) = ${heronArea} units²`}
        {step === 'verify' && <>Both methods give the same answer: ½bh = {halfBHArea} ≈ Heron = {heronArea}. <strong>Any triangle formula works!</strong></>}
      </div>

      <div className="formula-box text-sm">
        A = ½ × {base} × {height} = {halfBHArea} units²  |  Heron: {heronArea} units²
      </div>
    </div>
  )
}
