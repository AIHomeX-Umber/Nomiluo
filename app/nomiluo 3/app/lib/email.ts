import { Resend } from 'resend'
import { renderDailyBriefEmail } from './email-template'

const resend = new Resend(process.env.RESEND_API_KEY)

// 发件人（需在 Resend 后台验证域名后替换）
const FROM = '田螺姑娘 <brief@nomiluo.com>'

export async function sendDailyBrief({
  to,
  name,
  content,
}: {
  to: string
  name: string
  content: string
}) {
  const date = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const { html, text } = renderDailyBriefEmail({ name, content, date })

  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `${date}，她帮你理好了今天`,
    html,
    text,
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }

  return data
}

// 候补名单：收到邮件后发一封确认信
export async function sendWaitlistConfirmation({ to }: { to: string }) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject: '她记下你了',
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F0E6;font-family:'Noto Serif SC','Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F0E6;padding:60px 16px;">
<tr><td align="center">
  <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
    <tr>
      <td style="
        background:rgba(255,255,255,0.75);
        border:1px solid rgba(180,140,100,0.25);
        border-radius:20px;padding:48px 40px;text-align:center;
      ">
        <div style="
          width:52px;height:52px;background:#3D2314;border-radius:14px;
          font-size:22px;color:#F7F0E6;line-height:52px;
          margin:0 auto 28px;
        ">螺</div>
        <h1 style="font-size:24px;color:#3D2314;font-weight:400;margin:0 0 16px;letter-spacing:0.04em;">
          她记下你了。
        </h1>
        <p style="font-size:16px;color:#7A4F35;line-height:1.9;margin:0 0 32px;">
          准备好了，她第一个来找你。<br>
          在那之前，可以先和她聊聊。
        </p>
        <a href="https://nomiluo.com/chat"
          style="
            display:inline-block;background:#3D2314;color:#F7F0E6;
            padding:14px 32px;border-radius:99px;font-size:15px;
            text-decoration:none;letter-spacing:0.04em;
          ">先聊聊 →</a>
        <p style="font-size:13px;color:#B8926A;margin:32px 0 0;font-style:italic;">
          「壁炉边留一碗奶油，是对她唯一的致谢。」
        </p>
      </td>
    </tr>
  </table>
</td></tr>
</table>
</body>
</html>`,
    text: `她记下你了。\n\n准备好了，她第一个来找你。\n在那之前，可以先和她聊聊：https://nomiluo.com/chat\n\n— 田螺姑娘`,
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }

  return data
}
