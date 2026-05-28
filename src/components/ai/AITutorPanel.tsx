'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Brain, Loader2, Lightbulb, RotateCcw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type { AITutorMessage } from '@/types/user'

interface Props {
  lessonContext?: string
  shapeName?: string
  accentColor?: string
}

const suggestedQuestions = [
  'Why does this formula work?',
  'Give me a real-life example',
  'Explain step by step',
  'Give me a practice question',
]

export default function AITutorPanel({ lessonContext, shapeName, accentColor = '#2563EB' }: Props) {
  const [messages, setMessages] = useState<AITutorMessage[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI math tutor 👋 I'm here to help you understand ${shapeName ? `the ${shapeName}` : 'this lesson'} formula visually — not just memorize it. Ask me anything!`,
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: AITutorMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.slice(-8).map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          lessonContext,
          shapeName,
          conversationHistory: history,
        }),
      })

      const data = await res.json()
      const aiMsg: AITutorMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I had trouble connecting. Please try again!',
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Hi again! Feel free to ask any question about ${shapeName ? `the ${shapeName}` : 'this lesson'}.`,
      timestamp: new Date().toISOString(),
    }])
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Brain className="w-4 h-4" style={{ color: accentColor }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">AI Tutor</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Clear chat"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div
                  className="w-6 h-6 rounded-full mr-2 flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold"
                  style={{ backgroundColor: accentColor }}
                >
                  AI
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'}`}
                style={msg.role === 'user' ? { backgroundColor: accentColor } : {}}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc pl-4 my-1 space-y-0.5">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 my-1 space-y-0.5">{children}</ol>,
                      li: ({ children }) => <li className="text-sm">{children}</li>,
                      code: ({ children }) => <code className="bg-white/60 rounded px-1 font-mono text-xs">{children}</code>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="text-sm text-slate-500">Thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 2 && (
        <div className="py-3 space-y-1.5">
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            Suggested questions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-2.5 py-1 rounded-full border transition-colors"
                style={{
                  borderColor: `${accentColor}40`,
                  color: accentColor,
                  backgroundColor: `${accentColor}08`,
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-3 border-t border-slate-100">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder="Ask about this formula..."
          disabled={loading}
          className="flex-1 text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none transition-colors focus:border-blue-400 disabled:bg-slate-50"
          style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: accentColor }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
