'use client'

import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Cone, Cylinder } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

interface Props { accentColor?: string }

function ConeScene({ r, h, fillLevel, color }: { r: number; h: number; fillLevel: number; color: string }) {
  const coneRef = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    if (coneRef.current) coneRef.current.rotation.y += delta * 0.4
  })
  const rv = r / 40, hv = h / 40
  const cylFill = (fillLevel / 3) * hv
  return (
    <group>
      {/* Cone on left */}
      <group ref={coneRef} position={[-1.8, 0, 0]}>
        <Cone args={[rv, hv, 32]}>
          <meshStandardMaterial color={new THREE.Color(color)} opacity={0.85} transparent />
        </Cone>
      </group>
      {/* Cylinder on right */}
      <group position={[1.8, 0, 0]}>
        <Cylinder args={[rv, rv, hv, 32]}>
          <meshStandardMaterial color="#e2e8f0" opacity={0.4} transparent side={THREE.DoubleSide} />
        </Cylinder>
        {/* Fill level */}
        {cylFill > 0 && (
          <mesh position={[0, -(hv - cylFill) / 2, 0]}>
            <cylinderGeometry args={[rv * 0.98, rv * 0.98, cylFill, 32]} />
            <meshStandardMaterial color={new THREE.Color(color)} opacity={0.7} transparent />
          </mesh>
        )}
      </group>
    </group>
  )
}

export default function ConeSimulation({ accentColor = '#7C3AED' }: Props) {
  const [radius, setRadius] = useState(60)
  const [height, setHeight] = useState(100)
  const [pourCount, setPourCount] = useState(0)
  const [filling, setFilling] = useState(false)

  const vol = (1 / 3) * Math.PI * radius * radius * height / 10000
  const cylVol = Math.PI * radius * radius * height / 10000

  const handlePour = () => {
    if (pourCount >= 3 || filling) return
    setFilling(true)
    setTimeout(() => {
      setPourCount((p) => p + 1)
      setFilling(false)
    }, 800)
  }

  const handleReset = () => { setPourCount(0) }

  return (
    <div className="space-y-4">
      <div className="sim-container bg-slate-900 rounded-2xl overflow-hidden" style={{ height: '280px' }}>
        <Canvas camera={{ position: [4, 2, 4], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <ConeScene r={radius} h={height} fillLevel={pourCount} color={accentColor} />
          <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
        </Canvas>
      </div>

      <p className="text-xs text-center text-slate-400">Drag to rotate • Left: Cone | Right: Cylinder</p>

      <div className="space-y-3">
        {[
          { label: 'Radius (r)', value: radius, setter: setRadius, min: 20, max: 100 },
          { label: 'Height (h)', value: height, setter: setHeight, min: 40, max: 160 },
        ].map(({ label, value, setter, min, max }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-slate-600">{label}</label>
              <span className="text-xs font-bold" style={{ color: accentColor }}>{value} units</span>
            </div>
            <input type="range" min={min} max={max} value={value}
              onChange={(e) => { setter(Number(e.target.value)); handleReset() }}
              className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
          </div>
        ))}
      </div>

      {/* Pour counter */}
      <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200">
        <div>
          <p className="text-xs text-slate-500 font-medium">Cone pours into cylinder</p>
          <div className="flex gap-2 mt-1.5">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`w-12 h-5 rounded-full text-xs flex items-center justify-center font-bold transition-all
                ${pourCount >= n ? 'text-white' : 'bg-slate-200 text-slate-400'}`}
                style={pourCount >= n ? { backgroundColor: accentColor } : {}}>
                {n}/3
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePour}
            disabled={pourCount >= 3 || filling}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-40 transition-all"
            style={{ backgroundColor: accentColor }}>
            {filling ? '⏳' : '🫗 Pour'}
          </button>
          <button onClick={handleReset} disabled={pourCount === 0}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 disabled:opacity-40">
            ↩
          </button>
        </div>
      </div>

      {pourCount === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3 font-medium">
          🎉 3 cones filled 1 cylinder exactly! ∴ Cone volume = ⅓ × Cylinder = ⅓ × πr²h
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
          <p className="text-xs text-purple-500">Cone Volume</p>
          <p className="text-sm font-bold text-purple-700 font-mono">⅓πr²h</p>
          <p className="text-xs text-purple-600 mt-1">{vol.toFixed(1)} units³</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <p className="text-xs text-blue-500">Cylinder Volume</p>
          <p className="text-sm font-bold text-blue-700 font-mono">πr²h</p>
          <p className="text-xs text-blue-600 mt-1">{cylVol.toFixed(1)} units³</p>
        </div>
      </div>
    </div>
  )
}
