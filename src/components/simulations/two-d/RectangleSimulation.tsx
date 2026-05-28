'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props { accentColor?: string }

export default function RectangleSimulation({ accentColor = '#0891B2' }: Props) {
  const [len, setLen] = useState(8)
  const [wid, setWid] = useState(5)
  const [filled, setFilled] = useState(0)   // 0=empty, 1=filling, 2=full

  const W = 320, H = 240
  const cellW = Math.min(Math.floor((W - 60) / len), 30)
  const cellH = Math.min(Math.floor((H - 60) / wid), 30)
  const ox = (W - len * cellW) / 2
  const oy = (H - wid * cellH) / 2

  const area = len * wid

  const fill = () => setFilled(2)
  const reset = () => setFilled(0)

  return (
    <div className="space-y-4">
      <div className="sim-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas" style={{ maxHeight: '240px' }}>
          <defs>
            <pattern id="rectgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#rectgrid)" />

          {/* Unit squares */}
          {Array.from({ length: wid }).map((_, row) =>
            Array.from({ length: len }).map((_, col) => {
              const x = ox + col * cellW
              const y = oy + row * cellH
              const delay = (row * len + col) * 0.02
              return (
                <motion.rect
                  key={`${row}-${col}`}
                  x={x + 1} y={y + 1} width={cellW - 2} height={cellH - 2} rx="1"
                  fill={accentColor}
                  initial={{ opacity: 0.08 }}
                  animate={{ opacity: filled === 2 ? 0.65 : 0.08 }}
                  transition={{ delay: filled === 2 ? delay : 0, duration: 0.15 }}
                />
              )
            })
          )}

          {/* Rectangle border */}
          <rect x={ox} y={oy} width={len * cellW} height={wid * cellH}
            fill="none" stroke={accentColor} strokeWidth="2.5" />

          {/* Grid lines inside */}
          {Array.from({ length: len + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={ox + i * cellW} y1={oy} x2={ox + i * cellW} y2={oy + wid * cellH}
              stroke={accentColor} strokeWidth="0.5" opacity="0.4" />
          ))}
          {Array.from({ length: wid + 1 }).map((_, i) => (
            <line key={`h${i}`} x1={ox} y1={oy + i * cellH} x2={ox + len * cellW} y2={oy + i * cellH}
              stroke={accentColor} strokeWidth="0.5" opacity="0.4" />
          ))}

          {/* Labels */}
          <text x={ox + len * cellW / 2} y={oy - 8} fontSize="12" fill="#0F172A" textAnchor="middle" fontWeight="bold">
            l = {len}
          </text>
          <text x={ox - 10} y={oy + wid * cellH / 2} fontSize="12" fill="#0F172A" textAnchor="middle"
            fontWeight="bold" transform={`rotate(-90, ${ox - 10}, ${oy + wid * cellH / 2})`}>
            w = {wid}
          </text>

          {/* Count overlay */}
          {filled === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: len * wid * 0.02 + 0.1 }}>
              <rect x={(W - 180) / 2} y={H - 28} width="180" height="22" rx="6" fill={accentColor} opacity="0.95" />
              <text x={W / 2} y={H - 12} fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">
                {len} × {wid} = {area} unit squares = {area} units²
              </text>
            </motion.g>
          )}
        </svg>
      </div>

      {/* Sliders */}
      <div className="space-y-2">
        {[
          { label: 'Length (l)', value: len, min: 2, max: 12, set: (v: number) => { setLen(v); reset() } },
          { label: 'Width (w)', value: wid, min: 2, max: 8, set: (v: number) => { setWid(v); reset() } },
        ].map(({ label, value, min, max, set }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-slate-600">{label}</label>
              <span className="text-xs font-bold" style={{ color: accentColor }}>{value} units</span>
            </div>
            <input type="range" min={min} max={max} value={value}
              onChange={e => set(Number(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={fill} disabled={filled === 2}
          className="flex-1 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all text-white"
          style={{ backgroundColor: accentColor }}>
          🟦 Fill with Unit Squares
        </button>
        <button onClick={reset} disabled={filled === 0}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 disabled:opacity-40">
          Reset
        </button>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200">
        {filled === 0 && `The rectangle has ${len} columns and ${wid} rows. Click "Fill" to count unit squares!`}
        {filled === 2 && `${len} squares per row × ${wid} rows = ${area} squares total. Each has area 1, so A = ${area} units².`}
      </div>

      <div className="formula-box text-sm">A = l × w = {len} × {wid} = {area} units²</div>
    </div>
  )
}
