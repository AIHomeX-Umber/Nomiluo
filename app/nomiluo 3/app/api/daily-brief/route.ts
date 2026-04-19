import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '../../lib/supabase'
import { sendDailyBrief } from '../../lib/email'

export const runtime = 'nodejs'

// Vercel Cron 每天 UTC 00:00 触发 → 北京时间 08:00
export async function GET(req: NextRequest) {
  // 验证 Cron 密钥（Vercel 会自动注入）
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // 获取所有启用了每日简报的用户
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, name, timezone, preferences')
    .eq('daily_brief_enabled', true)

  if (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  let sent = 0
  const errors: string[] = []

  for (const user of users ?? []) {
    try {
      // 生成每日简报内容
      const brief = await generateDailyBrief(user)

      // 存入 briefs 表（后续可接邮件/推送）
      await supabase.from('daily_briefs').insert({
        user_id: user.id,
        content: brief,
        generated_at: new Date().toISOString(),
      })

      await sendDailyBrief({
        to: user.email,
        name: user.name ?? '',
        content: brief,
      })

      sent++
    } catch (e) {
      errors.push(`${user.id}: ${e}`)
    }
  }

  return NextResponse.json({
    ok: true,
    sent,
    errors: errors.length > 0 ? errors : undefined,
  })
}

async function generateDailyBrief(user: {
  id: string
  name: string
  preferences?: Record<string, unknown>
}): Promise<string> {
  const today = new Date().toLocaleDateString('zh-CN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const prompt = `你是田螺姑娘，为用户 ${user.name || '你'} 生成今天的生活简报。

今天是：${today}

简报格式（简洁，有温度，不超过200字）：
1. 一句开场（结合天气/节气/星期，或一句鼓励）
2. 今天需要记住的事（如果有）
3. 一个小提示或小惊喜

用户偏好：${JSON.stringify(user.preferences ?? {})}

直接输出简报内容，不要加标题或格式符号。`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://nomiluo.com',
      'X-Title': 'Nomiluo Daily Brief',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-haiku',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? '今天也会是好日子。'
}
