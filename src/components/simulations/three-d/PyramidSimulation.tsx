'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface Props { accentColor?: string }
type View = 'solid' | 'net' | 'volume'

function PyramidMesh({ base, height, view, accentColor }: { base: number; height: number; view: View; accentColor: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current && view !== 'net') groupRef.current.rotation.y += delta * 0.4
  })

  // Pyramid vertices
  const hh = height / 2
  const hb = base / 2
  const vertices = new Float32Array([
    // Base (2 triangles)
    -hb, -hh, -hb,   hb, -hh, -hb,   hb, -hh, hb,
    -hb, -hh, -hb,   hb, -hh, hb,   -hb, -hh, hb,
    // Front face
    -hb, -hh, hb,    hb, -hh, hb,    0, hh, 0,
    // Back face
    hb, -hh, -hb,   -hb, -hh, -hb,   0, hh, 0,
    // Left face
    -hb, -hh, -hb,  -hb, -hh, hb,    0, hh, 0,
    // Right face
    hb, -hh, hb,     hb, -hh, -hb,   0, hh, 0,
  ])

  const faceColors = [
    '#DC2626', '#DC2626',         // base (red)
    accentColor,                   // front
    accentColor,                   // back
    new THREE.Color(accentColor).clone().multiplyScalar(0.8).getStyle(), // left
    new THREE.Color(accentColor).clone().multiplyScalar(0.8).getStyle(), // right
  ]

  if (view === 'net') {
    // Show unfolded net as flat rectangles/triangles in SVG fallback text
    return (
      <group>
        {/* Base */}
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[base, base]} />
          <meshStandardMaterial color="#DC2626" opacity={0.85} transparent side={THREE.DoubleSide} />
        </mesh>
        {/* 4 triangular faces laid flat */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * Math.PI) / 2
          const dist = base / 2 + height * 0.6
          return (
            <mesh key={i} position={[Math.sin(angle) * dist, -0.01, Math.cos(angle) * dist]}
              rotation={[-Math.PI / 2, angle, 0]}>
              <coneGeometry args={[base / 2, height, 4, 1, true]} />
              <meshStandardMaterial color={accentColor} opacity={0.7} transparent side={THREE.DoubleSide} />
            </mesh>
          )
        })}
      </group>
    )
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geo.computeVertexNormals()

  return (
    <group ref={groupRef}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={accentColor} opacity={0.88} transparent side={THREE.DoubleSide} />
      </mesh>
      {/* Base outline */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(base, 0.02, base)]} />
        <lineBasicMaterial color="#DC2626" />
      </lineSegments>
      {view === 'volume' && (
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[base, height, base]} />
          <meshStandardMaterial color="#94a3b8" opacity={0.1} transparent wireframe />
        </mesh>
      )}
    </group>
  )
}

export default function PyramidSimulation({ accentColor = '#92400E' }: Props) {
  const [base, setBase] = useState(1.6)
  const [height, setHeight] = useState(1.8)
  const [view, setView] = useState<View>('solid')

  const b = base, h = height
  const slantH = Math.sqrt(h * h + (b / 2) * (b / 2))
  const volume = ((1 / 3) * b * b * h).toFixed(2)
  const sa = (b * b + 2 * b * slantH).toFixed(2)
  const prismVol = (b * b * h).toFixed(2)

  return (
    <div className="space-y-4">
      <div className="sim-container" style={{ height: '240px' }}>
        <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 3]} intensity={1} />
          <PyramidMesh base={base} height={height} view={view} accentColor={accentColor} />
          <OrbitControls enablePan={false} minDistance={2} maxDistance={10} />
        </Canvas>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { label: 'Volume', formula: '⅓b²h', value: volume, color: accentColor },
          { label: 'Surface Area', formula: 'b²+2bl', value: sa, color: '#0891b2' },
          { label: 'Prism Volume', formula: 'b²h', value: prismVol, color: '#64748b' },
          { label: 'Slant Height', formula: '√(h²+(b/2)²)', value: slantH.toFixed(2), color: '#64748b' },
        ].map(({ label, formula, value, color: c }) => (
          <div key={label} className="rounded-xl p-2.5 border border-slate-200 bg-slate-50">
            <p className="font-semibold text-slate-600">{label}</p>
            <p className="font-mono font-bold mt-0.5" style={{ color: c }}>{formula} = {value}</p>
          </div>
        ))}
      </div>

      {/* Sliders */}
      <div className="space-y-2">
        {[
          { label: 'Base side (b)', value: base, min: 0.8, max: 2.5, step: 0.1, set: setBase },
          { label: 'Height (h)', value: height, min: 0.5, max: 2.8, step: 0.1, set: setHeight },
        ].map(({ label, value, min, max, step: s, set }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-slate-600">{label}</label>
              <span className="text-xs font-bold" style={{ color: accentColor }}>{value.toFixed(1)}</span>
            </div>
            <input type="range" min={min} max={max} step={s} value={value}
              onChange={e => set(Number(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
          </div>
        ))}
      </div>

      {/* View buttons */}
      <div className="grid grid-cols-3 gap-2">
        {([
          { key: 'solid', label: '🔺 Pyramid' },
          { key: 'net', label: '📦 Net View' },
          { key: 'volume', label: '📊 ⅓ Prism' },
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
        {view === 'solid' && `Square base pyramid. Base = ${b.toFixed(1)}, Height = ${h.toFixed(1)}. Drag to rotate.`}
        {view === 'net' && `Unfolded net: 1 square base (b²) + 4 triangular faces. Each triangle area = ½×b×l = ½×${b.toFixed(1)}×${slantH.toFixed(2)}.`}
        {view === 'volume' && `The wire box shows a prism with volume b²h = ${prismVol}. A pyramid is exactly ⅓ of this prism, so V = ⅓b²h = ${volume}.`}
      </div>

      <div className="formula-box text-sm">V = ⅓b²h = ⅓×{b.toFixed(1)}²×{h.toFixed(1)} = {volume} units³</div>
    </div>
  )
}
