import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface GenerateRequest {
  shapeName: string
  lessonTitle: string
  formula: string
  difficulty: 'easy' | 'medium' | 'hard'
  count: number
}

export interface AIQuestion {
  type: 'mcq' | 'numerical'
  question: string
  options?: string[]
  correctIndex?: number
  answer?: string
  explanation: string
}

const DIFFICULTY_DESC = {
  easy: 'simple substitution with small whole numbers, basic formula recall, straightforward calculations',
  medium: 'multi-step calculations, word problems, use π ≈ 3.14, answers may be decimals',
  hard: 'reverse problems (find missing dimension given area/volume), algebraic manipulation, complex real-world scenarios, multi-shape comparisons',
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()
    const { shapeName, lessonTitle, formula, difficulty, count } = body

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({ error: 'No API key configured' }, { status: 503 })
    }

    const prompt = `Generate exactly ${count} quiz questions about "${lessonTitle}" (${shapeName}) for a high school geometry student.

Formula: ${formula}
Difficulty: ${difficulty} — ${DIFFICULTY_DESC[difficulty]}

Return ONLY a valid JSON array with no markdown, no extra text, no code fences.
Each element must follow one of these exact shapes:

MCQ type:
{"type":"mcq","question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correctIndex":0,"explanation":"full working shown here"}

Numerical type:
{"type":"numerical","question":"...","answer":"42.50","explanation":"full working shown here"}

Rules:
- Mix types: ~60% MCQ and ~40% numerical
- correctIndex is 0-based (0=A, 1=B, 2=C, 3=D)
- For numerical answers, round to 2 decimal places
- Each question must be different — vary the numbers, style, and focus
- Explanations must show step-by-step working
- Use standard math notation (e.g. pi, r^2) in question text

Respond with ONLY the JSON array.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.8 },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini quiz gen error:', err)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 })
    }

    const data = await response.json()
    const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    // Strip markdown code blocks if Gemini wraps in them
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

    const questions: AIQuestion[] = JSON.parse(cleaned)
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid quiz format returned')
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Generate quiz error:', error)
    return NextResponse.json({ error: 'Failed to generate quiz. Please try again.' }, { status: 500 })
  }
}
