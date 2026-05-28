'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Brain, Menu, X, BookOpen, BarChart2, MessageCircle, Home, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/geometry', label: 'Geometry', icon: BookOpen },
  { href: '/progress', label: 'Progress', icon: BarChart2 },
  { href: '/ai-tutor', label: 'AI Tutor', icon: MessageCircle },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />

  const isDark = theme === 'dark'
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Visual STEM AI</span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Interactive Learning</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${active
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA + Theme toggle */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/geometry"
              className="btn-primary text-sm py-2 px-4"
            >
              Start Learning
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 px-4 py-3 space-y-1 shadow-lg"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <Link
              href="/geometry"
              onClick={() => setMenuOpen(false)}
              className="btn-primary w-full justify-center text-sm"
            >
              Start Learning
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
