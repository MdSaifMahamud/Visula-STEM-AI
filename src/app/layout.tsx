import type { Metadata } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'

export const metadata: Metadata = {
  title: 'Visual STEM AI — Learn Formulas Visually',
  description:
    'Interactive simulation-based learning platform for Math and Science. Understand geometry formulas visually — not by memorizing.',
  keywords: ['geometry', 'math', 'science', 'interactive', 'simulation', 'learning', 'STEM'],
  openGraph: {
    title: 'Visual STEM AI',
    description: 'Learn geometry formulas visually through interactive simulations.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
