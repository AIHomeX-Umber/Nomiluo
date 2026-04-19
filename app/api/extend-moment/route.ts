import { NextRequest, NextResponse } from 'next/server'
import { basePersonaPrompt } from '@/lib/prompts/basePersona'
import { extendMomentPrompt } from '@/lib/prompts/extendMoment'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }
    const systemPrompt = `${basePersonaPrompt}\n\n${extendMomentPrompt}`.trim()
    const userPrompt = `用户刚刚说了一句：\n\n"${text}"\n\n请顺着这句话，继续往下说一点。`
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://nomiluo.com',
        'X-Title': '田螺姑娘',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    })
    const data = await response.json()
    const output = data.choices?.[0]?.message?.content?.trim() || ''
    return NextResponse.json({ text: output })
  } catch {
    return NextResponse.json({ error: 'Failed to extend moment' }, { status: 500 })
  }
}
