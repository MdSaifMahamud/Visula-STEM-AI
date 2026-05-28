import type { Metadata } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'Geometry — Learn Formulas Visually',
  description:
    'Interactive simulation-based learning platform for geometry. Understand area and volume formulas visually — not by memorizing.',
  keywords: ['geometry', 'math', 'interactive', 'simulation', 'learning', 'shapes', '2D', '3D'],
  openGraph: {
    title: 'Geometry',
    description: 'Learn geometry formulas visually through interactive simulations.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
