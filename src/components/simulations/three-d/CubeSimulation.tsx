'use client'

import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box, Edges } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import * as THREE from 'three'

interface Props { accentColor?: string; isCuboid?: boolean }

function RotatingCube({ a, l, w, h, isCuboid, showNet, color }: {
  a: number; l: number; w: number; h: number; isCuboid: boolean
  showNet: boolean; color: string
}) {
  const groupRef = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    if (groupRef.current && !showNet) {
      groupRef.current.rotation.y += delta * 0.5
      groupRef.current.rotation.x += delta * 0.2
    }
  })

  const lv = isCuboid ? l / 40 : a / 40
  const wv = isCuboid ? w / 40 : a / 40
  const hv = isCuboid ? h / 40 : a / 40
  const c = new THREE.Color(color)

  if (showNet) {
    // Show an unfolded net layout
    const faceColor = new THREE.Color(color)
    const faces = [
      { pos: [0, 0, 0] as [number,number,number], size: [lv, hv, 0.02] as [number,number,number] },        // front
      { pos: [0, hv + 0.1, 0] as [number,number,number], size: [lv, hv, 0.02] as [number,number,number] },  // top
      { pos: [0, -(hv + 0.1), 0] as [number,number,number], size: [lv, hv, 0.02] as [number,number,number] }, // bottom
      { pos: [lv + 0.1, 0, 0] as [number,number,number], size: [lv, hv, 0.02] as [number,number,number] },  // right
      { pos: [-(lv + 0.1), 0, 0] as [number,number,number], size: [lv, hv, 0.02] as [number,number,number] }, // left
      { pos: [0, -(hv + 0.1) * 2, 0] as [number,number,number], size: [lv, hv, 0.02] as [number,number,number] }, // extra
    ]
    return (
      <group>
        {faces.map((f, i) => (
          <mesh key={i} position={f.pos}>
            <boxGeometry args={f.size} />
            <meshStandardMaterial color={c} opacity={0.85} transparent />
            <Edges color="white" />
          </mesh>
        ))}
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      <Box args={[lv, hv, wv]}>
        <meshStandardMaterial color={c} opacity={0.85} transparent />
        <Edges color="white" lineWidth={1.5} />
      </Box>
    </group>
  )
}

export default function CubeSimulation({ accentColor = '#DC2626', isCuboid = false }: Props) {
  const [a, setA] = useState(80)
  const [l, setL] = useState(120)
  const [w, setW] = useState(80)
  const [h, setH] = useState(60)
  const [showNet, setShowNet] = useState(false)
  const [showVolBlocks, setShowVolBlocks] = useState(false)

  const side = isCuboid ? l : a
  const width = isCuboid ? w : a
  const height = isCuboid ? h : a

  const sa = isCuboid
    ? 2 * (l * w + w * h + l * h) / 100
    : 6 * a * a / 100
  const vol = isCuboid
    ? l * w * h / 1000
    : a * a * a / 1000

  return (
    <div className="space-y-4">
      {/* 3D Canvas */}
      <div className="sim-container bg-slate-900 rounded-2xl overflow-hidden" style={{ height: '280px' }}>
        <Canvas camera={{ position: [3, 2.5, 3], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <RotatingCube a={a} l={l} w={w} h={h} isCuboid={isCuboid} showNet={showNet} color={accentColor} />
          <OrbitControls enablePan={false} minDistance={2} maxDistance={8} />
        </Canvas>
      </div>

      <p className="text-xs text-center text-slate-400">Drag to rotate • Scroll to zoom</p>

      {/* Sliders */}
      {isCuboid ? (
        <div className="space-y-3">
          {[
            { label: 'Length (l)', value: l, setter: setL },
            { label: 'Width (w)', value: w, setter: setW },
            { label: 'Height (h)', value: h, setter: setH },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-slate-600">{label}</label>
                <span className="text-xs font-bold" style={{ color: accentColor }}>{value} units</span>
              </div>
              <input type="range" min={30} max={160} value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium text-slate-600">Side length (a)</label>
            <span className="text-xs font-bold" style={{ color: accentColor }}>{a} units</span>
          </div>
          <input type="range" min={30} max={120} value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor }} />
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={() => setShowNet(!showNet)}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all border-2
            ${showNet ? 'border-current' : 'border-slate-200 hover:border-slate-300'}`}
          style={{ color: accentColor, backgroundColor: showNet ? `${accentColor}10` : 'white' }}>
          {showNet ? '📦 Show Solid' : '📋 Show Net (Unfold)'}
        </button>
      </div>

      {/* Formulas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <p className="text-xs text-blue-500 font-medium mb-1">Surface Area</p>
          <p className="text-sm font-bold text-blue-700 font-mono">
            {isCuboid ? `2(lw+wh+lh)` : `6a²`}
          </p>
          <p className="text-xs text-blue-600 mt-1">≈ {sa.toFixed(1)} units²</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
          <p className="text-xs text-purple-500 font-medium mb-1">Volume</p>
          <p className="text-sm font-bold text-purple-700 font-mono">
            {isCuboid ? `l×w×h` : `a³`}
          </p>
          <p className="text-xs text-purple-600 mt-1">= {vol.toFixed(1)} units³</p>
        </div>
      </div>

      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200 leading-relaxed">
        {showNet
          ? '📋 The cube is unfolded into 6 square faces (a net). Adding all 6 faces gives the total surface area.'
          : `🔄 Drag to rotate the ${isCuboid ? 'cuboid' : 'cube'}. The ${isCuboid ? 'cuboid' : 'cube'} has ${isCuboid ? '3 pairs' : '6 identical square'} faces.`
        }
      </div>
    </div>
  )
}
