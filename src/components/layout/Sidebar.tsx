'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, BookOpen, BarChart2, MessageCircle, ChevronRight,
  Circle, Triangle, Square, Layers, Home, ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import { lessons } from '@/lib/lessons'

const mainNav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/progress', label: 'My Progress', icon: BarChart2 },
  { href: '/ai-tutor', label: 'AI Tutor', icon: MessageCircle },
]

const shape2DLinks = lessons
  .filter((l) => l.shapeType === '2D')
  .map((l) => ({ href: l.routePath, label: l.shape, available: l.available }))

const shape3DLinks = lessons
  .filter((l) => l.shapeType === '3D')
  .map((l) => ({ href: l.routePath, label: l.shape, available: l.available }))

function NavGroup({
  title,
  icon: Icon,
  links,
  basePath,
}: {
  title: string
  icon: React.ElementType
  links: { href: string; label: string; available: boolean }[]
  basePath: string
}) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(basePath)
  const [open, setOpen] = useState(isActive)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
      >
        <span className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-slate-100 pl-3">
              {links.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.available ? link.href : '#'}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors
                      ${active ? 'text-blue-600 bg-blue-50 font-medium' : ''}
                      ${link.available
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        : 'text-slate-300 cursor-not-allowed'
                      }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 shrink-0" />
                      {link.label}
                    </span>
                    {!link.available && (
                      <span className="text-[10px] text-slate-300 border border-slate-200 rounded px-1">Soon</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 hidden lg:flex flex-col z-40">
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* Main navigation */}
        {mainNav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${active ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}

        <div className="pt-3 pb-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3">Geometry</p>
        </div>

        <NavGroup
          title="2D Shapes"
          icon={Square}
          links={shape2DLinks}
          basePath="/geometry"
        />
        <NavGroup
          title="3D Shapes"
          icon={Layers}
          links={shape3DLinks}
          basePath="/geometry"
        />
      </div>

      {/* Bottom section — fixed at the bottom of the sidebar */}
      <div className="shrink-0 p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            S
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Student</p>
            <p className="text-xs text-slate-400">Learning Mode</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
