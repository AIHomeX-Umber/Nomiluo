import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '田螺姑娘 · Nomiluo',
  description: '你的生活 AI 管家——默默付出，懂你，把你想做的事提前做了。',
  keywords: ['AI管家', '生活助理', '田螺姑娘', 'Nomiluo'],
  openGraph: {
    title: '田螺姑娘 · Nomiluo',
    description: '你出门时，她悄悄出来，把一切都打理好了。',
    url: 'https://nomiluo.com',
    siteName: 'Nomiluo',
    locale: 'zh_CN',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
