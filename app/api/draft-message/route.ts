import { NextRequest, NextResponse } from 'next/server'
import { basePersonaPrompt } from '@/lib/prompts/basePersona'
import { draftMessagePrompt } from '@/lib/prompts/draftMessage'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { target_name, tone } = await req.json()
    if (!target_name) {
      return NextResponse.json({ error: 'Missing target_name' }, { status: 400 })
    }
    const systemPrompt = `${basePersonaPrompt}\n\n${draftMessagePrompt}`.trim()
    const userPrompt = `用户想联系的人是：${target_name}\n语气：${tone || 'casual'}\n\n请写一条可以直接发送的消息。`
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
    const message = data.choices?.[0]?.message?.content?.trim() || ''
    return NextResponse.json({ message })
  } catch {
    return NextResponse.json({ error: 'Failed to generate draft message' }, { status: 500 })
  }
}
