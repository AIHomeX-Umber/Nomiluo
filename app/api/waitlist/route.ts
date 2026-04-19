import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '../../lib/supabase'

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
    // 重复邮箱不报错，静默处理
    if (error.code === '23505') {
      return NextResponse.json({ ok: true })
    }
    console.error('Waitlist insert error:', error)
    return NextResponse.json({ error: '写入失败' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
