'use client'

import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Cylinder, Edges } from '@react-three/drei'
import * as THREE from 'three'

interface Props { accentColor?: string }

function CylinderMesh({ r, h, color, showNet }: { r: number; h: number; color: string; showNet: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    if (groupRef.current && !showNet) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  const rv = r / 40
  const hv = h / 40
  const c = new THREE.Color(color)

  if (showNet) {
    return (
      <group>
        {/* Top circle */}
        <mesh position={[0, hv + 0.2, 0]}>
          <cylinderGeometry args={[rv, rv, 0.05, 32]} />
          <meshStandardMaterial color={c} opacity={0.8} transparent />
        </mesh>
        {/* Bottom circle */}
        <mesh position={[0, -(hv + 0.2), 0]}>
          <cylinderGeometry args={[rv, rv, 0.05, 32]} />
          <meshStandardMaterial color={c} opacity={0.8} transparent />
        </mesh>
        {/* Rectangle (unrolled curved surface) */}
        <mesh position={[rv * 2 + 0.3, 0, 0]}>
          <boxGeometry args={[2 * Math.PI * rv, hv, 0.05]} />
          <meshStandardMaterial color={new THREE.Color('#7C3AED')} opacity={0.8} transparent />
          <Edges color="white" />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      <Cylinder args={[rv, rv, hv, 32]}>
        <meshStandardMaterial color={c} opacity={0.85} transparent />
      </Cylinder>
    </group>
  )
}

export default function CylinderSimulation({ accentColor = '#0891B2' }: Props) {
  const [radius, setRadius] = useState(60)
  const [height, setHeight] = useState(100)
  const [showNet, setShowNet] = useState(false)

  const vol = Math.PI * radius * radius * height / 10000
  const csa = 2 * Math.PI * radius * height / 100
  const tsa = (2 * Math.PI * radius * height + 2 * Math.PI * radius * radius) / 100

  return (
    <div className="space-y-4">
      <div className="sim-container bg-slate-900 rounded-2xl overflow-hidden" style={{ height: '280px' }}>
        <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <CylinderMesh r={radius} h={height} color={accentColor} showNet={showNet} />
          <OrbitControls enablePan={false} minDistance={2} maxDistance={8} />
        </Canvas>
      </div>

      <p className="text-xs text-center text-slate-400">Drag to rotate • Scroll to zoom</p>

      <div className="space-y-3">
        {[
          { label: 'Radius (r)', value: radius, setter: setRadius, min: 20, max: 100 },
          { label: 'Height (h)', value: height, setter: setHeight, min: 30, max: 160 },
        ].map(({ label, value, setter, min, max }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-slate-600">{label}</label>
              <span className="text-xs font-bold" style={{ color: accentColor }}>{value} units</span>
            </div>
            <input type="range" min={min} max={max} value={value}
              onChange={(e) => setter(Number(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
          </div>
        ))}
      </div>

      <button onClick={() => setShowNet(!showNet)}
        className={`w-full py-2 rounded-xl text-xs font-semibold transition-all border-2
          ${showNet ? 'border-current' : 'border-slate-200 hover:border-slate-300'}`}
        style={{ color: accentColor, backgroundColor: showNet ? `${accentColor}10` : 'white' }}>
        {showNet ? '🔵 Show Cylinder' : '📋 Open Net (Unroll)'}
      </button>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-2">
          <p className="text-xs text-blue-500">Volume</p>
          <p className="text-xs font-bold text-blue-700 font-mono mt-0.5">πr²h</p>
          <p className="text-xs text-blue-600">{vol.toFixed(1)}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-2">
          <p className="text-xs text-purple-500">Curved SA</p>
          <p className="text-xs font-bold text-purple-700 font-mono mt-0.5">2πrh</p>
          <p className="text-xs text-purple-600">{csa.toFixed(1)}</p>
        </div>
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-2">
          <p className="text-xs text-cyan-500">Total SA</p>
          <p className="text-xs font-bold text-cyan-700 font-mono mt-0.5">2πr(r+h)</p>
          <p className="text-xs text-cyan-600">{tsa.toFixed(1)}</p>
        </div>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200">
        {showNet
          ? '📋 Unrolled: two circles (top & bottom) + one rectangle. The rectangle has width = 2πr (circumference) and height = h.'
          : '🔵 A cylinder is a stack of circles! Volume = base area × height = πr²h'}
      </div>
    </div>
  )
}
