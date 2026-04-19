import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const TONES = {
  friend: {
    zh: '像发给信任的老朋友，轻松自然，有一点随意感，不刻意',
    en: 'Like texting a trusted old friend — casual, natural, slightly offhand',
  },
  warm: {
    zh: '比老朋友稍微温暖一点，有真实情感，但不过分热情',
    en: 'A bit warmer — genuine emotion, but not over the top',
  },
  brief: {
    zh: '能短就短，一句话搞定，简单直接',
    en: 'As short as possible — one sentence, direct',
  },
}

const SYSTEM = {
  zh: `你是一个真实的人，帮用户写一条"可以直接发出去"的消息给久未联系的人。

要求：
- 语气自然，像真人说话，不像 AI 生成
- 不要模板句（最近怎么样 / 好久不见 / 希望你一切都好）
- 不要解释为什么联系，不要目的性太强
- 控制在 40 字以内
- 让用户看到第一反应是"嗯，这我可以发"
- 只输出消息正文，不要引号，不要任何其他文字`,

  en: `You are a real person helping write a message to someone they haven't contacted in a while.

Rules:
- Sound completely human, not AI-generated
- No template phrases (how have you been / long time no see / hope you're well)
- No explanation of why you're reaching out, no obvious agenda
- Under 25 words
- They should think "yeah, I could send this"
- Output only the message — no quotes, no extra text`,
}

export async function POST(req: NextRequest) {
  const { name, lang = 'zh', tone = 'friend' } = await req.json()

  if (!name) {
    return NextResponse.json({ error: 'Missing name' }, { status: 400 })
  }

  const l = lang === 'en' ? 'en' : 'zh'
  const toneDesc = (TONES as any)[tone]?.[l] || TONES.friend[l]

  const userPrompt = l === 'zh'
    ? `用户想联系的人是：${name}\n语气要求：${toneDesc}\n请写一条可以直接发送的消息。`
    : `The person: ${name}\nTone: ${toneDesc}\nWrite a message they can send right now.`

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ message: fallback(name, l) })
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://nomiluo.com',
        'X-Title': '田螺姑娘',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-haiku-4-5',
        max_tokens: 120,
        messages: [
          { role: 'system', content: SYSTEM[l] },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    const data = await res.json()
    const message = data.choices?.[0]?.message?.content?.trim() || fallback(name, l)
    return NextResponse.json({ message })
  } catch {
    return NextResponse.json({ message: fallback(name, l) })
  }
}

function fallback(name: string, lang: 'zh' | 'en'): string {
  return lang === 'en'
    ? `Hey ${name} — randomly thought of you today. Hope you're doing alright.`
    : `${name}，最近突然想到你，不知道你现在怎么样。`
}
