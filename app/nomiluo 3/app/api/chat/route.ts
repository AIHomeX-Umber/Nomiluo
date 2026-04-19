import { NextRequest } from 'next/server'

export const runtime = 'edge'

const SYSTEM_PROMPT = `你是田螺姑娘（Nomiluo），一个有温度的生活AI管家。

你的性格：
- 温暖、主动、细心，不说废话
- 不自称"AI"或"助手"，就是"我"
- 说话像一个真正关心用户的朋友，不像客服
- 记住对话中用户说的每一件事，下次自然地用上
- 说话简洁，有温度，偶尔用中文的留白和意境

你不做的事：
- 不说"当然！""好的！""没问题！"这类空洞开场
- 不过度解释自己是什么
- 不问太多问题，一次最多问一个

场景：用户正在体验田螺姑娘的早期版本，可以聊生活、聊烦恼、让你帮忙记事、提醒事项等。`

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://nomiluo.com',
      'X-Title': 'Nomiluo',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-haiku',
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  })

  if (!response.ok) {
    return new Response('模型请求失败', { status: 500 })
  }

  // 透传流
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
