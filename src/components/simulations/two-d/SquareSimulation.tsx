'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props { accentColor?: string }

export default function SquareSimulation({ accentColor = '#0369a1' }: Props) {
  const [side, setSide] = useState(7)
  const [filled, setFilled] = useState(false)

  const W = 320, H = 260
  const cell = Math.min(Math.floor((W - 60) / side), 32)
  const ox = (W - side * cell) / 2
  const oy = (H - side * cell) / 2
  const area = side * side

  return (
    <div className="space-y-4">
      <div className="sim-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas" style={{ maxHeight: '260px' }}>
          <defs>
            <pattern id="sqgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#sqgrid)" />

          {/* Unit squares */}
          {Array.from({ length: side }).map((_, row) =>
            Array.from({ length: side }).map((_, col) => (
              <motion.rect key={`${row}-${col}`}
                x={ox + col * cell + 1} y={oy + row * cell + 1}
                width={cell - 2} height={cell - 2} rx="1"
                fill={accentColor}
                initial={{ opacity: 0.08 }}
                animate={{ opacity: filled ? 0.65 : 0.08 }}
                transition={{ delay: filled ? (row * side + col) * 0.015 : 0, duration: 0.12 }}
              />
            ))
          )}

          {/* Border */}
          <rect x={ox} y={oy} width={side * cell} height={side * cell}
            fill="none" stroke={accentColor} strokeWidth="3" />

          {/* Equal-side tick marks */}
          {[0, 1, 2, 3].map((edgeIdx) => {
            const mx = edgeIdx === 0 ? ox + (side * cell) / 2 : edgeIdx === 2 ? ox + (side * cell) / 2 : edgeIdx === 1 ? ox + side * cell : ox
            const my = edgeIdx === 0 ? oy : edgeIdx === 2 ? oy + side * cell : oy + (side * cell) / 2
            const dx = edgeIdx === 0 || edgeIdx === 2 ? 5 : 0
            const dy = edgeIdx === 1 || edgeIdx === 3 ? 5 : 0
            return <line key={edgeIdx} x1={mx - dx} y1={my - dy} x2={mx + dx} y2={my + dy}
              stroke={accentColor} strokeWidth="2.5" />
          })}

          {/* Grid lines */}
          {Array.from({ length: side + 1 }).map((_, i) => (
            <g key={i}>
              <line x1={ox + i * cell} y1={oy} x2={ox + i * cell} y2={oy + side * cell}
                stroke={accentColor} strokeWidth="0.5" opacity="0.35" />
              <line x1={ox} y1={oy + i * cell} x2={ox + side * cell} y2={oy + i * cell}
                stroke={accentColor} strokeWidth="0.5" opacity="0.35" />
            </g>
          ))}

          {/* Labels */}
          <text x={ox + side * cell / 2} y={oy - 8} fontSize="12" fill="#0F172A" textAnchor="middle" fontWeight="bold">a = {side}</text>
          <text x={ox - 14} y={oy + side * cell / 2 + 4} fontSize="12" fill="#0F172A" textAnchor="middle" fontWeight="bold"
            transform={`rotate(-90, ${ox - 14}, ${oy + side * cell / 2 + 4})`}>a = {side}</text>

          {filled && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: side * side * 0.015 + 0.1 }}>
              <rect x={(W - 180) / 2} y={H - 28} width="180" height="22" rx="6" fill={accentColor} opacity="0.95" />
              <text x={W / 2} y={H - 12} fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">
                {side} × {side} = {area} = a² squares
              </text>
            </motion.g>
          )}
        </svg>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <label className="text-xs font-medium text-slate-600">Side length (a)</label>
          <span className="text-xs font-bold" style={{ color: accentColor }}>{side} units</span>
        </div>
        <input type="range" min={2} max={10} value={side}
          onChange={e => { setSide(Number(e.target.value)); setFilled(false) }}
          className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setFilled(true)} disabled={filled}
          className="flex-1 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 text-white transition-all"
          style={{ backgroundColor: accentColor }}>
          🟦 Fill with Unit Squares
        </button>
        <button onClick={() => setFilled(false)} disabled={!filled}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 disabled:opacity-40">
          Reset
        </button>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200">
        {!filled
          ? `A square has ${side} equal sides. All angles are 90°. It's a special rectangle where l = w = a.`
          : `${side} columns × ${side} rows = ${area} unit squares. A = a × a = a² = ${area} units².`}
      </div>

      <div className="formula-box text-sm">A = a² = {side}² = {area} units²</div>
    </div>
  )
}
