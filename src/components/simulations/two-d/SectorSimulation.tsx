'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props { accentColor?: string }

export default function SectorSimulation({ accentColor = '#7C3AED' }: Props) {
  const [radius, setRadius] = useState(90)
  const [angleDeg, setAngleDeg] = useState(120)

  const W = 320, H = 270
  const cx = W / 2, cy = H / 2 + 15

  const fraction = angleDeg / 360
  const area = (fraction * Math.PI * radius * radius).toFixed(1)
  const arcLen = (fraction * 2 * Math.PI * radius).toFixed(1)

  // Build sector SVG path
  const startRad = -Math.PI / 2
  const endRad = startRad + (angleDeg * Math.PI) / 180
  const x1 = cx + radius * Math.cos(startRad)
  const y1 = cy + radius * Math.sin(startRad)
  const x2 = cx + radius * Math.cos(endRad)
  const y2 = cy + radius * Math.sin(endRad)
  const largeArc = angleDeg > 180 ? 1 : 0

  const sectorPath = `M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`

  // Full circle faded
  const fullPath = `M ${cx},${cy - radius} A ${radius},${radius} 0 1 1 ${cx - 0.001},${cy - radius} Z`

  // Angle arc for label
  const angleR = 28
  const ax1 = cx + angleR * Math.cos(startRad)
  const ay1 = cy + angleR * Math.sin(startRad)
  const ax2 = cx + angleR * Math.cos(endRad)
  const ay2 = cy + angleR * Math.sin(endRad)
  const midRad = startRad + (endRad - startRad) / 2
  const labelX = cx + (angleR + 14) * Math.cos(midRad)
  const labelY = cy + (angleR + 14) * Math.sin(midRad)

  return (
    <div className="space-y-4">
      <div className="sim-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas" style={{ maxHeight: '270px' }}>
          <defs>
            <pattern id="sectgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#sectgrid)" />

          {/* Full circle outline */}
          <path d={fullPath} fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.2" />
          {/* Full circle faded fill */}
          <path d={fullPath} fill={accentColor} opacity="0.07" />

          {/* Sector */}
          <motion.path d={sectorPath} fill={accentColor} opacity={0.82} stroke="white" strokeWidth="2"
            animate={{ d: sectorPath }} transition={{ duration: 0.1 }} />

          {/* Angle arc */}
          <path d={`M ${ax1},${ay1} A ${angleR},${angleR} 0 ${largeArc} 1 ${ax2},${ay2}`}
            fill="none" stroke="white" strokeWidth="1.5" />
          <text x={labelX} y={labelY + 4} fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">
            {angleDeg}°
          </text>

          {/* Radius labels */}
          <text x={(cx + x1) / 2 + 6} y={(cy + y1) / 2} fontSize="10" fill="white" fontWeight="bold">r={radius}</text>

          {/* Fraction label */}
          <rect x={4} y={4} width="150" height="38" rx="6" fill="white" opacity="0.95" stroke="#e2e8f0" strokeWidth="1" />
          <text x={10} y={17} fontSize="9" fill="#475569" fontWeight="bold">Fraction of circle:</text>
          <text x={10} y={30} fontSize="9" fill={accentColor} fontWeight="bold">{angleDeg}/360 = {(fraction * 100).toFixed(1)}%</text>

          {/* Arc length */}
          <text x={cx} y={H - 10} fontSize="10" fill="#0F172A" textAnchor="middle">
            Arc length = {arcLen} units
          </text>
        </svg>
      </div>

      <div className="space-y-2">
        {[
          { label: 'Radius (r)', value: radius, min: 40, max: 120, set: setRadius },
          { label: 'Angle (θ°)', value: angleDeg, min: 15, max: 350, set: setAngleDeg },
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

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        A sector with angle {angleDeg}° is <strong>{(fraction * 100).toFixed(1)}%</strong> of the full circle.
        Full circle area = πr² = {(Math.PI * radius * radius).toFixed(1)}.
        Sector area = {(fraction * 100).toFixed(1)}% × {(Math.PI * radius * radius).toFixed(1)} = <strong>{area} units²</strong>.
      </div>

      <div className="formula-box text-sm">
        A = (θ/360)×πr² = ({angleDeg}/360)×π×{radius}² ≈ {area} units²
      </div>
    </div>
  )
}
