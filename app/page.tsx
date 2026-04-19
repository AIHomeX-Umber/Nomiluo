'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('done')
        setMessage('她记下你了，会在合适的时候出现。')
        setEmail('')
      } else {
        throw new Error()
      }
    } catch {
      setStatus('error')
      setMessage('出了点小问题，再试一次？')
    }
  }

  return (
    <main className={styles.main}>
      {/* 背景装饰 */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgOrb3} />

      {/* 顶部 */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoChar}>螺</span>
          <span className={styles.logoText}>nomiluo</span>
        </div>
        <a href="/chat" className={styles.chatLink}>试试她 →</a>
      </header>

      {/* 主体 */}
      <section className={styles.hero}>
        <div className={styles.tagBadge}>即将到来 · Coming Soon</div>

        <h1 className={styles.title}>
          <span className={styles.titleMain}>田螺姑娘</span>
          <span className={styles.titleSub}>你的生活，她在默默打理</span>
        </h1>

        <p className={styles.lede}>
          你出门时，壳里的她悄悄出来——<br />
          饭煮好了，事情理好了，重要的日子她记得。<br />
          你回来只看见结果，不见过程。
        </p>

        {/* aha moment 入口 */}
        <div className={styles.ahaEntry}>
          <p className={styles.ahaHint}>有没有一个人，你一直想联系却还没联系？</p>
          <a href="/chat" className={styles.ahaBtn}>
            让她帮你写第一句话 →
          </a>
        </div>

        {/* 邮件收集 */}
        <div className={styles.waitlistBox}>
          {status === 'done' ? (
            <p className={styles.successMsg}>{message}</p>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                placeholder="留下你的邮箱，她第一个来找你"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.emailInput}
                required
              />
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? '记下了…' : '通知我'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className={styles.errorMsg}>{message}</p>
          )}
          <p className={styles.formNote}>不发广告，只在准备好时联系你。</p>
        </div>
      </section>

      {/* 三个能力 */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>记</div>
          <h3>她记得</h3>
          <p>家人的生日、你说过想做的事、你的生活节奏——不需要你反复交代。</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>判</div>
          <h3>她提前</h3>
          <p>不等你开口，她知道什么时候该出现，提前把事情做好了。</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>陪</div>
          <h3>她陪着</h3>
          <p>不是冷冰冰的回答。越用越懂你，越懂越像你生活的一部分。</p>
        </div>
      </section>

      {/* 故事引用 */}
      <section className={styles.story}>
        <blockquote className={styles.quote}>
          <p>「壁炉边留一碗奶油，是对她唯一的致谢。」</p>
          <cite>— 苏格兰 Brownie 传说</cite>
        </blockquote>
      </section>

      {/* 底部 */}
      <footer className={styles.footer}>
        <p>Mashi · 2026</p>
        <p className={styles.footerLinks}>
          <a href="mailto:hello@nomiluo.com">hello@nomiluo.com</a>
          <span>·</span>
          <a href="https://aimakox.com" target="_blank" rel="noopener">Makox →</a>
        </p>
      </footer>
    </main>
  )
}
