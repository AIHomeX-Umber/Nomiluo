export function renderDailyBriefEmail({
  name,
  content,
  date,
}: {
  name: string
  content: string
  date: string
}): { html: string; text: string } {
  // 把换行转成段落
  const paragraphs = content
    .split('\n')
    .filter(Boolean)
    .map(p => `<p style="margin:0 0 16px;line-height:1.9;color:#3D2314;">${p}</p>`)
    .join('')

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>田螺姑娘的每日简报</title>
</head>
<body style="margin:0;padding:0;background:#F7F0E6;font-family:'Noto Serif SC','Georgia',serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F0E6;padding:40px 16px;">
<tr><td align="center">

  <!-- 主卡片 -->
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

    <!-- 顶部品牌 -->
    <tr>
      <td style="padding:0 0 28px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="
              width:36px;height:36px;
              background:#3D2314;
              border-radius:10px;
              text-align:center;
              vertical-align:middle;
              font-size:16px;color:#F7F0E6;
            ">螺</td>
            <td style="padding-left:10px;font-size:13px;color:#7A4F35;font-style:italic;letter-spacing:0.05em;">
              nomiluo
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- 日期标签 -->
    <tr>
      <td style="padding:0 0 20px;">
        <span style="
          font-size:12px;letter-spacing:0.1em;
          color:#B8926A;border:1px solid #D4B896;
          padding:4px 14px;border-radius:99px;
        ">${date}</span>
      </td>
    </tr>

    <!-- 主体内容卡片 -->
    <tr>
      <td style="
        background:rgba(255,255,255,0.75);
        border:1px solid rgba(180,140,100,0.25);
        border-radius:20px;
        padding:36px 40px;
      ">
        <!-- 问候 -->
        <p style="
          margin:0 0 24px;
          font-size:22px;color:#3D2314;
          font-weight:400;letter-spacing:0.04em;
        ">早安${name ? '，' + name : ''}。</p>

        <!-- 简报正文 -->
        <div style="font-size:16px;">
          ${paragraphs}
        </div>

        <!-- 分隔线 -->
        <div style="border-top:1px solid rgba(180,140,100,0.2);margin:28px 0;"></div>

        <!-- 行动按钮 -->
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="
              background:#3D2314;border-radius:99px;
            ">
              <a href="https://nomiluo.com/chat"
                style="
                  display:inline-block;
                  padding:12px 28px;
                  font-size:14px;color:#F7F0E6;
                  text-decoration:none;letter-spacing:0.04em;
                ">和她说说话 →</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- 底部引用 -->
    <tr>
      <td style="padding:32px 0 8px;text-align:center;">
        <p style="
          font-size:13px;color:#B8926A;
          font-style:italic;margin:0 0 6px;
        ">「壁炉边留一碗奶油，是对她唯一的致谢。」</p>
        <p style="font-size:12px;color:#B8926A;margin:0;">— 苏格兰 Brownie 传说</p>
      </td>
    </tr>

    <!-- 退订 -->
    <tr>
      <td style="padding:24px 0 0;text-align:center;border-top:1px solid rgba(180,140,100,0.15);margin-top:8px;">
        <p style="font-size:12px;color:#B8926A;margin:0;">
          你收到这封信是因为订阅了田螺姑娘每日简报。
          <a href="https://nomiluo.com/unsubscribe" style="color:#B8926A;">退订</a>
        </p>
      </td>
    </tr>

  </table>
</td></tr>
</table>

</body>
</html>`

  // 纯文本版本
  const text = `早安${name ? '，' + name : ''}。

${content}

---
和她说说话：https://nomiluo.com/chat

田螺姑娘每日简报 · nomiluo.com
退订：https://nomiluo.com/unsubscribe`

  return { html, text }
}
