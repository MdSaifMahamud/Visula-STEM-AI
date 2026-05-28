'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props { accentColor?: string }

export default function RhombusSimulation({ accentColor = '#C026D3' }: Props) {
  const [d1, setD1] = useState(140)
  const [d2, setD2] = useState(100)
  const [showTriangles, setShowTriangles] = useState(false)

  const W = 320, H = 280
  const cx = W / 2, cy = H / 2

  // Rhombus corners from diagonals
  const top    = { x: cx,          y: cy - d2 / 2 }
  const right  = { x: cx + d1 / 2, y: cy }
  const bottom = { x: cx,          y: cy + d2 / 2 }
  const left   = { x: cx - d1 / 2, y: cy }

  const rhombusPath = `M ${top.x},${top.y} L ${right.x},${right.y} L ${bottom.x},${bottom.y} L ${left.x},${left.y} Z`

  const area = (0.5 * d1 * d2).toFixed(0)

  const triangleColors = ['#EF4444', '#F97316', '#10B981', '#3B82F6']

  return (
    <div className="space-y-4">
      <div className="sim-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas" style={{ maxHeight: '280px' }}>
          <defs>
            <pattern id="rhgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#rhgrid)" />

          {showTriangles ? (
            <>
              {/* 4 coloured right triangles */}
              {[
                { pts: `${cx},${cy} ${top.x},${top.y} ${right.x},${right.y}`, color: triangleColors[0] },
                { pts: `${cx},${cy} ${right.x},${right.y} ${bottom.x},${bottom.y}`, color: triangleColors[1] },
                { pts: `${cx},${cy} ${bottom.x},${bottom.y} ${left.x},${left.y}`, color: triangleColors[2] },
                { pts: `${cx},${cy} ${left.x},${left.y} ${top.x},${top.y}`, color: triangleColors[3] },
              ].map(({ pts, color }, i) => (
                <motion.polygon
                  key={i}
                  points={pts}
                  fill={color}
                  opacity={0.7}
                  stroke="white"
                  strokeWidth="1.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                />
              ))}
              {/* Right angle marker at centre */}
              <rect x={cx + 2} y={cy - 10} width="8" height="8" fill="none" stroke="white" strokeWidth="1.5" />
            </>
          ) : (
            <motion.path
              d={rhombusPath}
              fill={accentColor}
              opacity={0.82}
              stroke="white"
              strokeWidth="2"
              animate={{ d: rhombusPath }}
              transition={{ duration: 0.12 }}
            />
          )}

          {/* Always draw diagonals */}
          <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="white" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.9" />
          <line x1={top.x}  y1={top.y}  x2={bottom.x} y2={bottom.y} stroke="white" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.9" />

          {/* d1 label */}
          <text x={cx} y={cy + d2 / 2 + 16} fontSize="10" fill="#0F172A" textAnchor="middle" fontWeight="bold">
            d₁ = {d1}
          </text>
          {/* d2 label */}
          <text x={cx + d1 / 2 + 12} y={cy + 4} fontSize="10" fill="#0F172A" textAnchor="start" fontWeight="bold">
            d₂ = {d2}
          </text>

          {/* Info box */}
          <rect x={4} y={4} width="145" height="40" rx="6" fill="white" opacity="0.95" stroke="#e2e8f0" strokeWidth="1" />
          <text x={10} y={17} fontSize="9" fill="#475569" fontWeight="bold">Area = ½ × d₁ × d₂</text>
          <text x={10} y={30} fontSize="10" fill={accentColor} fontWeight="bold">
            = ½ × {d1} × {d2} = {area} units²
          </text>
        </svg>
      </div>

      <div className="space-y-2">
        {[
          { label: 'Diagonal d₁ (horizontal)', value: d1, min: 60, max: 200, set: setD1 },
          { label: 'Diagonal d₂ (vertical)',   value: d2, min: 40, max: 180, set: setD2 },
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

      {/* Toggle triangles */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setShowTriangles(false)}
          className="py-2 rounded-xl text-xs font-semibold transition-all"
          style={!showTriangles ? { backgroundColor: accentColor, color: 'white' } : { backgroundColor: '#f1f5f9', color: '#64748b' }}>
          ◇ Rhombus
        </button>
        <button
          onClick={() => setShowTriangles(true)}
          className="py-2 rounded-xl text-xs font-semibold transition-all"
          style={showTriangles ? { backgroundColor: accentColor, color: 'white' } : { backgroundColor: '#f1f5f9', color: '#64748b' }}>
          △ 4 Triangles
        </button>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        {showTriangles
          ? `The two diagonals split the rhombus into 4 congruent right triangles. Each has legs d₁/2 = ${(d1/2).toFixed(0)} and d₂/2 = ${(d2/2).toFixed(0)}, area = ${(d1*d2/8).toFixed(1)} units². Total = 4 × ${(d1*d2/8).toFixed(1)} = ${area} units².`
          : `A rhombus with diagonals d₁ = ${d1} and d₂ = ${d2}. The diagonals are perpendicular bisectors of each other (right angle at centre).`
        }
      </div>

      <div className="formula-box text-sm">A = ½d₁d₂ = ½×{d1}×{d2} = {area} units²</div>
    </div>
  )
}
