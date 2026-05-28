'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Scissors, AlignJustify } from 'lucide-react'

interface Props {
  accentColor?: string
}

type AnimState = 'circle' | 'cut' | 'rearrange' | 'rectangle'

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function sectorPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToCartesian(cx, cy, r, startDeg)
  const e = polarToCartesian(cx, cy, r, endDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`
}

const SECTOR_COLORS = [
  '#2563EB', '#7C3AED', '#0891B2', '#059669', '#D97706',
  '#DC2626', '#DB2777', '#4F46E5', '#0D9488', '#65A30D',
  '#EA580C', '#9333EA', '#0284C7', '#16A34A', '#CA8A04',
  '#E11D48',
]

export default function CircleSimulation({ accentColor = '#2563EB' }: Props) {
  const [radius, setRadius] = useState(80)
  const [sectorCount, setSectorCount] = useState(16)
  const [animState, setAnimState] = useState<AnimState>('circle')
  const [showFormula, setShowFormula] = useState(true)
  const [showExplanation, setShowExplanation] = useState(true)
  const [animProgress, setAnimProgress] = useState(0)
  const animRef = useRef<number | null>(null)

  const CX = 160
  const CY = 160
  const W = 320
  const H = 320

  // Rearranged rectangle dimensions
  const rectWidth = Math.PI * radius  // = πr
  const rectHeight = radius           // = r
  const rectX = (W - rectWidth) / 2
  const rectY = CY + 20

  const animateTo = useCallback((target: AnimState) => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    const duration = 700
    const start = Date.now()
    const step = () => {
      const elapsed = Date.now() - start
      const t = Math.min(elapsed / duration, 1)
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      setAnimProgress(eased)
      if (t < 1) {
        animRef.current = requestAnimationFrame(step)
      } else {
        setAnimState(target)
        setAnimProgress(1)
      }
    }
    animRef.current = requestAnimationFrame(step)
  }, [])

  const handleCut = () => {
    setAnimState('cut')
    setAnimProgress(1)
  }

  const handleRearrange = () => {
    setAnimState('rearrange')
    animateTo('rectangle')
  }

  const handleReset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setAnimState('circle')
    setAnimProgress(0)
  }

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current) }, [])

  const anglePerSector = 360 / sectorCount

  // Build sector data for each piece
  const sectors = Array.from({ length: sectorCount }, (_, i) => {
    const start = i * anglePerSector
    const end = start + anglePerSector
    const isTop = i % 2 === 0  // alternating orientation for rearrangement

    // In rearranged state: sectors are laid out horizontally in a row
    const sectorWidth = (2 * radius * Math.sin((anglePerSector / 2) * Math.PI / 180))
    const totalWidth = sectorCount * sectorWidth * 0.98
    const startX = (W - totalWidth) / 2 + i * sectorWidth * 0.98

    return {
      start,
      end,
      color: SECTOR_COLORS[i % SECTOR_COLORS.length],
      isTop,
      rectX: startX,
    }
  })

  const isRearranged = animState === 'rectangle'
  const isCut = animState === 'cut' || animState === 'rearrange' || isRearranged

  return (
    <div className="space-y-4">
      {/* SVG Simulation */}
      <div className="sim-container">
        <svg viewBox="0 0 320 380" className="sim-canvas" style={{ maxHeight: '360px' }}>
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="320" height="380" fill="url(#grid)" />

          {/* ── Rearranged state: parallelogram / rectangle ── */}
          {isRearranged && (
            <>
              {sectors.map((s, i) => {
                const sAngle = (s.start + s.end) / 2
                const sectorHeight = radius
                const baseWidth = radius * Math.tan((anglePerSector / 2) * Math.PI / 180) * 2
                const x = s.rectX
                const yBase = CY + 10

                const points = s.isTop
                  ? `${x},${yBase} ${x + baseWidth},${yBase} ${x + baseWidth / 2},${yBase - sectorHeight} ${x + baseWidth / 2},${yBase - sectorHeight}`
                  : `${x},${yBase} ${x + baseWidth},${yBase} ${x + baseWidth},${yBase + sectorHeight} ${x},${yBase + sectorHeight}`

                return (
                  <motion.polygon
                    key={i}
                    points={s.isTop
                      ? `${x + baseWidth / 2},${yBase - sectorHeight} ${x},${yBase} ${x + baseWidth},${yBase}`
                      : `${x},${yBase} ${x + baseWidth},${yBase} ${x + baseWidth / 2},${yBase + sectorHeight}`}
                    fill={s.color}
                    opacity={0.85}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    transition={{ delay: i * 0.03 }}
                  />
                )
              })}

              {/* Labels on rearranged shape */}
              {showFormula && (
                <>
                  {/* Height arrow */}
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <line x1="20" y1={CY + 10} x2="20" y2={CY + 10 + radius} stroke="#0F172A" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    <text x="8" y={CY + 10 + radius / 2} fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="bold">r</text>

                    {/* Base arrow */}
                    <line x1={sectors[0]?.rectX ?? 30} y1={CY + 10 + radius + 20}
                      x2={(sectors[sectors.length - 1]?.rectX ?? 280) + 12} y2={CY + 10 + radius + 20}
                      stroke="#0F172A" strokeWidth="1.5" />
                    <text
                      x={CX}
                      y={CY + 10 + radius + 34}
                      fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="bold"
                    >
                      πr ≈ {(Math.PI * radius).toFixed(0)}
                    </text>
                  </motion.g>
                </>
              )}

              {/* Final formula */}
              {showFormula && (
                <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <rect x="80" y={CY + radius + 55} width="160" height="28" rx="8" fill={accentColor} opacity="0.9" />
                  <text x="160" y={CY + radius + 74} fontSize="13" fill="white" textAnchor="middle" fontWeight="bold">
                    A = πr × r = πr²
                  </text>
                </motion.g>
              )}
            </>
          )}

          {/* ── Circle (original or cut) ── */}
          {!isRearranged && (
            <>
              {isCut ? (
                /* Cut sectors with small gaps */
                sectors.map((s, i) => (
                  <motion.path
                    key={i}
                    d={sectorPath(CX, CY, radius, s.start, s.end)}
                    fill={s.color}
                    opacity={0.88}
                    initial={{ scale: 1 }}
                    animate={{
                      transform: `translate(${((i - sectorCount / 2 + 0.5) * 0.5)}px, ${(i % 2 === 0 ? -2 : 2)}px)`,
                    }}
                  />
                ))
              ) : (
                /* Full circle */
                <>
                  <circle cx={CX} cy={CY} r={radius} fill={accentColor} opacity={0.15} />
                  {sectors.map((s, i) => (
                    <path
                      key={i}
                      d={sectorPath(CX, CY, radius, s.start, s.end)}
                      fill={s.color}
                      opacity={0.7}
                      stroke="white"
                      strokeWidth={isCut ? 1 : 0.5}
                    />
                  ))}
                  {/* Radius line */}
                  {showFormula && (
                    <>
                      <line x1={CX} y1={CY} x2={CX + radius} y2={CY} stroke="#0F172A" strokeWidth="2" strokeDasharray="4 2" />
                      <text x={CX + radius / 2} y={CY - 8} fontSize="13" fill="#0F172A" textAnchor="middle" fontWeight="bold">r = {radius}</text>
                    </>
                  )}
                  {/* Center dot */}
                  <circle cx={CX} cy={CY} r="4" fill="#0F172A" />
                </>
              )}

              {/* Cut state - show separation lines */}
              {isCut && sectors.map((s, i) => (
                <motion.path
                  key={`cut-${i}`}
                  d={sectorPath(CX, CY, radius, s.start, s.end)}
                  fill={s.color}
                  opacity={0.88}
                  stroke="white"
                  strokeWidth="1.5"
                  animate={{
                    transform: `translate(${(i % 2 === 0 ? -1.5 : 1.5)}px, ${(i % 2 === 0 ? -1.5 : 1.5)}px)`,
                  }}
                />
              ))}
            </>
          )}

          {/* Arrow defs */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0F172A" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        {/* Radius */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-600">Radius (r)</label>
            <span className="text-xs font-bold" style={{ color: accentColor }}>{radius} units</span>
          </div>
          <input
            type="range" min="40" max="100" value={radius}
            onChange={(e) => { setRadius(Number(e.target.value)); handleReset() }}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor }}
          />
        </div>

        {/* Sector count */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-600">Number of Sectors</label>
            <span className="text-xs font-bold" style={{ color: accentColor }}>{sectorCount} sectors</span>
          </div>
          <div className="flex gap-2">
            {[8, 16, 32, 64].map((n) => (
              <button
                key={n}
                onClick={() => { setSectorCount(n); handleReset() }}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all"
                style={{
                  borderColor: sectorCount === n ? accentColor : '#e2e8f0',
                  color: sectorCount === n ? accentColor : '#64748b',
                  backgroundColor: sectorCount === n ? `${accentColor}10` : 'white',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCut}
          disabled={animState !== 'circle'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <Scissors className="w-3.5 h-3.5" />
          Cut Circle
        </button>
        <button
          onClick={handleRearrange}
          disabled={animState !== 'cut'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold bg-purple-50 text-purple-600 transition-all disabled:opacity-40"
        >
          <AlignJustify className="w-3.5 h-3.5" />
          Rearrange
        </button>
        <button
          onClick={handleReset}
          disabled={animState === 'circle'}
          className="px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition-all disabled:opacity-40"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Toggles */}
      <div className="flex gap-3">
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showFormula}
            onChange={(e) => setShowFormula(e.target.checked)}
            className="rounded"
          />
          Show Formula
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showExplanation}
            onChange={(e) => setShowExplanation(e.target.checked)}
            className="rounded"
          />
          Show Explanation
        </label>
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-200"
          >
            {animState === 'circle' && '👆 Press "Cut Circle" to divide it into sectors (like pizza slices). Try more sectors for a better result!'}
            {animState === 'cut' && '✂️ The circle is cut into sectors. Now press "Rearrange" to see them transform into a rectangle.'}
            {animState === 'rectangle' && (
              <>🔷 The sectors form a shape close to a <strong>rectangle</strong>! Height = <strong>r</strong>, Base = <strong>πr</strong>. Area = πr × r = <strong>πr²</strong>. With more sectors, it gets even closer to a perfect rectangle!</>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live calculation */}
      {showFormula && (
        <div className="formula-box text-sm">
          A = π × r² = π × {radius}² ≈ {(Math.PI * radius * radius).toFixed(1)} units²
        </div>
      )}
    </div>
  )
}
