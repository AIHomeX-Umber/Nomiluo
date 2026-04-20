'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [emailMsg, setEmailMsg] = useState('')

  // extend-moment 状态
  const [moment, setMoment] = useState('')
  const [momentResult, setMomentResult] = useState('')
  const [momentStatus, setMomentStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setEmailStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setEmailStatus('done')
        setEmailMsg('她记下你了，会在合适的时候出现。')
        setEmail('')
      } else throw new Error()
    } catch {
      setEmailStatus('error')
      setEmailMsg('出了点小问题，再试一次？')
    }
  }

  async function handleMoment(e: React.FormEvent) {
    e.preventDefault()
    if (!moment.trim()) return
    setMomentStatus('loading')
    try {
      const res = await fetch('/api/extend-moment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: moment }),
      })
      const data = await res.json()
      setMomentResult(data.text || '')
      setMomentStatus('done')
    } catch {
      setMomentResult('好像有点什么，说不太清楚。\n但你注意到了，\n这件事本身就有意义。')
      setMomentStatus('done')
    }
  }

  function handleReset() {
    setMoment('')
    setMomentResult('')
    setMomentStatus('idle')
  }

  return (
    <main className={styles.main}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgOrb3} />

      {/* 顶部 */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoChar}>螺</span>
          <span className={styles.logoText}>nomiluo</span>
        </div>
        <a href="/chat" className={styles.chatLink}>先聊聊 →</a>
      </header>

      {/* 主体 */}
      <section className={styles.hero}>
        <div className={styles.tagBadge}>即将到来 · Coming Soon</div>

        <h1 className={styles.title}>
          <span className={styles.titleMain}>田螺姑娘</span>
          <span className={styles.titleSub}>你的生活，她在默默打理</span>
        </h1>

        {/* 示例卡片 — 首屏核心情绪 */}
        <div className={styles.momentCard}>
          <p className={styles.momentCardText}>
            你今天其实有一刻停了一下。
          </p>
          <p className={styles.momentCardText}>
            不是因为累，<br />
            是因为突然有点不确定——
          </p>
          <p className={styles.momentCardText}>
            你在做的这些事，<br />
            是不是正在变得没那么重要了。
          </p>
          <p className={styles.momentCardCite}>她注意到了。</p>
        </div>

        {/* extend-moment 入口 */}
        <div className={styles.momentEntry}>
          {momentStatus === 'idle' && (
            <form onSubmit={handleMoment} className={styles.momentForm}>
              <p className={styles.momentPrompt}>
                那一刻是什么时候？<br />
                <span>随便说一句就好。</span>
              </p>
              <div className={styles.momentInputRow}>
                <input
                  type="text"
                  value={moment}
                  onChange={e => setMoment(e.target.value)}
                  placeholder="今天有一刻…"
                  className={styles.momentInput}
                  maxLength={100}
                />
                <button
                  type="submit"
                  className={styles.momentBtn}
                  disabled={!moment.trim()}
                >
                  让她接住
                </button>
              </div>
            </form>
          )}

          {momentStatus === 'loading' && (
            <div className={styles.momentLoading}>
              <span className={styles.momentDot} />
              <span className={styles.momentDot} />
              <span className={styles.momentDot} />
            </div>
          )}

          {momentStatus === 'done' && momentResult && (
            <div className={styles.momentResult}>
              {momentResult.split('\n').map((line, i) => (
                <p key={i} className={styles.momentResultLine}>{line}</p>
              ))}
              <button onClick={handleReset} className={styles.momentReset}>
                再说一句
              </button>
            </div>
          )}
        </div>

        {/* 邮件收集 */}
        <div className={styles.waitlistBox}>
          {emailStatus === 'done' ? (
            <p className={styles.successMsg}>{emailMsg}</p>
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
                disabled={emailStatus === 'loading'}
              >
                {emailStatus === 'loading' ? '记下了…' : '通知我'}
              </button>
            </form>
          )}
          {emailStatus === 'error' && (
            <p className={styles.errorMsg}>{emailMsg}</p>
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
