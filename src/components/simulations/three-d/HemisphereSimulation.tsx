'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

interface Props { accentColor?: string }
type View = 'solid' | 'curved' | 'base' | 'total'

function HemisphereMesh({ radius, view, accentColor }: { radius: number; view: View; accentColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const baseRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.4
    if (baseRef.current) baseRef.current.rotation.y += delta * 0.4
  })

  const color = new THREE.Color(accentColor)

  return (
    <group>
      {/* Hemisphere (top half of sphere) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={view === 'curved' || view === 'total' ? accentColor : color.clone().multiplyScalar(0.7).getStyle()}
          transparent opacity={view === 'curved' || view === 'total' ? 0.88 : 0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flat circular base */}
      <mesh ref={baseRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial
          color={view === 'base' || view === 'total' ? '#DC2626' : '#94a3b8'}
          transparent opacity={view === 'base' || view === 'total' ? 0.85 : 0.3}
        />
      </mesh>
    </group>
  )
}

export default function HemisphereSimulation({ accentColor = '#BE185D' }: Props) {
  const [radius, setRadius] = useState(1.2)
  const [view, setView] = useState<View>('solid')

  const r = radius
  const curvedSA = (2 * Math.PI * r * r).toFixed(2)
  const baseSA = (Math.PI * r * r).toFixed(2)
  const totalSA = (3 * Math.PI * r * r).toFixed(2)
  const volume = ((2 / 3) * Math.PI * r * r * r).toFixed(2)

  return (
    <div className="space-y-4">
      <div className="sim-container" style={{ height: '240px' }}>
        <Canvas camera={{ position: [0, 2, 4], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1} />
          <HemisphereMesh radius={radius} view={view} accentColor={accentColor} />
          <OrbitControls enablePan={false} minDistance={2} maxDistance={8} />
        </Canvas>
      </div>

      {/* Info card */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { label: 'Curved Surface', formula: '2πr²', value: curvedSA, highlight: view === 'curved' || view === 'total', color: accentColor },
          { label: 'Flat Base', formula: 'πr²', value: baseSA, highlight: view === 'base' || view === 'total', color: '#DC2626' },
          { label: 'Total SA', formula: '3πr²', value: totalSA, highlight: view === 'total', color: accentColor },
          { label: 'Volume', formula: '⅔πr³', value: volume, highlight: false, color: '#64748b' },
        ].map(({ label, formula, value, highlight, color: c }) => (
          <div key={label} className={`rounded-xl p-2.5 border transition-all ${highlight ? 'border-current shadow-sm' : 'border-slate-200 bg-slate-50'}`}
            style={highlight ? { borderColor: c, backgroundColor: `${c}10` } : {}}>
            <p className="font-semibold text-slate-600">{label}</p>
            <p className="font-mono font-bold mt-0.5" style={{ color: c }}>{formula} = {value}</p>
          </div>
        ))}
      </div>

      {/* Radius slider */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-xs font-medium text-slate-600">Radius (r)</label>
          <span className="text-xs font-bold" style={{ color: accentColor }}>{radius.toFixed(1)} units</span>
        </div>
        <input type="range" min={0.6} max={1.8} step={0.1} value={radius}
          onChange={e => setRadius(Number(e.target.value))}
          className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
      </div>

      {/* View buttons */}
      <div className="grid grid-cols-4 gap-1.5">
        {([
          { key: 'solid', label: '3D Shape' },
          { key: 'curved', label: 'Curved SA' },
          { key: 'base', label: 'Flat Base' },
          { key: 'total', label: 'Total SA' },
        ] as { key: View; label: string }[]).map(({ key, label }) => (
          <button key={key} onClick={() => setView(key)}
            className="py-2 rounded-xl text-xs font-semibold transition-all"
            style={view === key
              ? { backgroundColor: accentColor, color: 'white' }
              : { backgroundColor: '#f1f5f9', color: '#64748b' }}>
            {label}
          </button>
        ))}
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        {view === 'solid' && 'A hemisphere is exactly half a sphere. Drag to rotate the 3D shape.'}
        {view === 'curved' && `Curved surface = half of sphere surface = 4πr²/2 = 2πr² = ${curvedSA} units².`}
        {view === 'base' && `The cut creates a flat circle of radius r. Base area = πr² = ${baseSA} units².`}
        {view === 'total' && `Total SA = Curved + Base = 2πr² + πr² = 3πr² = ${totalSA} units². Volume = ⅔πr³ = ${volume} units³.`}
      </div>

      <div className="formula-box text-sm">SA = 3πr² = {totalSA} units² · V = ⅔πr³ = {volume} units³</div>
    </div>
  )
}
