import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface TutorRequest {
  message: string
  lessonContext?: string
  shapeName?: string
  language?: 'english' | 'bangla'
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
}

const SYSTEM_PROMPT = `You are a friendly and encouraging math teacher for Visual STEM AI.

Your job is to help students understand geometry formulas VISUALLY — not just give them the formula.

Rules:
1. Always explain WHY the formula works, not just the formula itself.
2. Use simple, short sentences. Avoid unnecessary advanced math.
3. Relate answers to visual simulations (cutting circles into sectors, rearranging triangles, etc.)
4. Give real-life examples whenever possible.
5. If the student asks in Bangla, respond completely in Bangla.
6. If the student gives a wrong answer, be polite and guide them to the right thinking.
7. Never just state a formula — always explain the visual intuition behind it.
8. If asked to generate a practice question, create a simple, relevant question with the answer.

Example style for cone volume:
"Imagine a cone and a cylinder with the same base radius and height. If you fill the cone with water and pour it into the cylinder, it fills only 1/3 of the cylinder. Do it 3 times and the cylinder is full. That is why cone volume = (1/3) × cylinder volume = (1/3)πr²h."

Keep responses concise — around 3-6 sentences unless the student asks for more detail.`

export async function POST(req: NextRequest) {
  try {
    const body: TutorRequest = await req.json()
    const { message, lessonContext, shapeName, conversationHistory = [] } = body

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({
        response: getFallbackResponse(message, shapeName),
      })
    }

    const contextMessage = lessonContext
      ? `The student is currently on the "${lessonContext}" lesson${shapeName ? ` about the ${shapeName}` : ''}.`
      : ''

    const systemWithContext = contextMessage
      ? `${SYSTEM_PROMPT}\n\nCurrent context: ${contextMessage}`
      : SYSTEM_PROMPT

    const contents = [
      ...conversationHistory.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemWithContext }] },
          contents,
          generationConfig: { maxOutputTokens: 512 },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini API error:', error)
      return NextResponse.json(
        { response: getFallbackResponse(message, shapeName) },
        { status: 200 }
      )
    }

    const data = await response.json()
    const assistantMessage =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'I could not generate a response.'

    return NextResponse.json({ response: assistantMessage })
  } catch (error) {
    console.error('AI tutor error:', error)
    return NextResponse.json(
      { response: 'Sorry, I had trouble connecting. Please try again!' },
      { status: 200 }
    )
  }
}

function getFallbackResponse(message: string, shapeName?: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('circle') || shapeName?.toLowerCase() === 'circle') {
    return "Great question! For the circle area, imagine cutting the circle into many pizza-like sectors. When you rearrange them, they form a rectangle. The height of this rectangle is r (the radius), and the base is πr (half the circumference). So Area = base × height = πr × r = πr²! The more sectors you cut, the closer it gets to a perfect rectangle."
  }
  if (lower.includes('triangle')) {
    return "For triangles, think of this: make a copy of the triangle, flip it upside down, and attach it to the original. You get a parallelogram! Since two triangles make one parallelogram (Area = b×h), one triangle must be half that: Area = ½ × b × h."
  }
  if (lower.includes('cylinder')) {
    return "A cylinder is just a stack of circles! Each circle has area πr², and if you stack them to height h, you get Volume = πr²h. For surface area, unroll the curved surface — it becomes a rectangle with width = 2πr and height = h, giving curved SA = 2πrh. Add two circular ends: Total SA = 2πr² + 2πrh."
  }
  if (lower.includes('cone')) {
    return "Here's a fun experiment: take a cone and a cylinder with the same base and height. Fill the cone with water and pour it into the cylinder. Do this 3 times — and the cylinder is exactly full! So 3 cones = 1 cylinder, meaning cone volume = ⅓ × πr²h."
  }
  if (lower.includes('sphere')) {
    return "The sphere surface area equals 4 circles of the same radius: SA = 4πr². For volume, Archimedes discovered that a sphere fits inside a cylinder (radius=r, height=2r) and fills exactly ⅔ of it. Cylinder volume = 2πr³, so sphere volume = ⅔ × 2πr³ = 4/3πr³."
  }
  if (lower.includes('why') || lower.includes('how')) {
    return `This is a fantastic question! Every geometry formula has a visual proof behind it. The key idea is that we can always rearrange shapes without changing their area or volume. Try interacting with the simulation above — drag the sliders and press the animation buttons to see the visual proof unfold step by step!`
  }

  return `Great question! The best way to understand geometry is through visual simulation. Try the interactive simulation on this page — adjust the sliders, press the animation buttons, and watch the formula emerge naturally from the shape. What specifically about ${shapeName ?? 'this shape'} would you like to understand better?`
}
