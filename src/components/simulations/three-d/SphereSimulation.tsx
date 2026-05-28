'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

interface Props { accentColor?: string }

function SphereScene({ r, mode, color }: { r: number; mode: string; color: string }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4
  })
  const rv = r / 50

  return (
    <group ref={ref}>
      {mode === 'sphere' && (
        <Sphere args={[rv, 32, 32]}>
          <meshStandardMaterial color={new THREE.Color(color)} opacity={0.85} transparent />
        </Sphere>
      )}

      {mode === 'circles' && (
        <group>
          <Sphere args={[rv, 32, 32]} position={[-1.8, 0, 0]}>
            <meshStandardMaterial color={new THREE.Color(color)} opacity={0.85} transparent />
          </Sphere>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[rv + 0.5 + i * (rv * 2 + 0.15), 0, 0]}>
              <cylinderGeometry args={[rv, rv, 0.05, 32]} />
              <meshStandardMaterial color={new THREE.Color('#2563EB')} opacity={0.75} transparent />
            </mesh>
          ))}
        </group>
      )}

      {mode === 'cylinder' && (
        <group>
          {/* Cylinder */}
          <Cylinder args={[rv, rv, rv * 2, 32]}>
            <meshStandardMaterial color="#e2e8f0" opacity={0.35} transparent side={THREE.DoubleSide} />
          </Cylinder>
          {/* Sphere inside */}
          <Sphere args={[rv, 32, 32]}>
            <meshStandardMaterial color={new THREE.Color(color)} opacity={0.8} transparent />
          </Sphere>
        </group>
      )}
    </group>
  )
}

export default function SphereSimulation({ accentColor = '#DB2777' }: Props) {
  const [radius, setRadius] = useState(60)
  const [mode, setMode] = useState('sphere')

  const sa = 4 * Math.PI * radius * radius / 100
  const vol = (4 / 3) * Math.PI * Math.pow(radius, 3) / 10000
  const cylVol = Math.PI * radius * radius * 2 * radius / 10000

  const modes = [
    { key: 'sphere', label: 'Sphere' },
    { key: 'circles', label: '4 Circles' },
    { key: 'cylinder', label: 'In Cylinder' },
  ]

  return (
    <div className="space-y-4">
      <div className="sim-container bg-slate-900 rounded-2xl overflow-hidden" style={{ height: '280px' }}>
        <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <SphereScene r={radius} mode={mode} color={accentColor} />
          <OrbitControls enablePan={false} minDistance={2} maxDistance={10} />
        </Canvas>
      </div>

      <p className="text-xs text-center text-slate-400">Drag to rotate • Scroll to zoom</p>

      <div>
        <div className="flex justify-between mb-1">
          <label className="text-xs font-medium text-slate-600">Radius (r)</label>
          <span className="text-xs font-bold" style={{ color: accentColor }}>{radius} units</span>
        </div>
        <input type="range" min={20} max={100} value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
      </div>

      <div className="flex gap-2">
        {modes.map((m) => (
          <button key={m.key} onClick={() => setMode(m.key)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all border-2"
            style={{
              borderColor: mode === m.key ? accentColor : '#e2e8f0',
              color: mode === m.key ? accentColor : '#64748b',
              backgroundColor: mode === m.key ? `${accentColor}10` : 'white',
            }}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-center">
          <p className="text-xs text-pink-500">Surface Area</p>
          <p className="text-sm font-bold text-pink-700 font-mono">4πr²</p>
          <p className="text-xs text-pink-600 mt-1">{sa.toFixed(1)} units²</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
          <p className="text-xs text-purple-500">Volume</p>
          <p className="text-sm font-bold text-purple-700 font-mono">4/3πr³</p>
          <p className="text-xs text-purple-600 mt-1">{vol.toFixed(1)} units³</p>
        </div>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        {mode === 'sphere' && '🌍 A perfect sphere. Press "4 Circles" to see why surface area = 4πr².'}
        {mode === 'circles' && `4 flat circles of radius ${radius} have total area = 4πr² = ${sa.toFixed(1)}. That's exactly equal to the sphere's surface!`}
        {mode === 'cylinder' && `The sphere fits inside a cylinder (r=${radius}, h=${2*radius}). Sphere fills ⅔ of the cylinder! V_cyl=${cylVol.toFixed(1)}, V_sphere=${vol.toFixed(1)} = ⅔×${cylVol.toFixed(1)}.`}
      </div>
    </div>
  )
}
