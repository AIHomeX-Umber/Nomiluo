import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '../../lib/supabase'
import { sendWaitlistConfirmation } from '../../lib/email'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: '邮箱格式不对' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('waitlist')
    .insert({ email, created_at: new Date().toISOString() })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ ok: true })
    }
    console.error('Waitlist insert error:', error)
    return NextResponse.json({ error: '写入失败' }, { status: 500 })
  }

  // 发确认邮件（失败不影响注册流程）
  try {
    await sendWaitlistConfirmation({ to: email })
  } catch (e) {
    console.error('Confirmation email failed:', e)
  }

  return NextResponse.json({ ok: true })
}
