'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './chat.module.css'

type Step = 'ask' | 'loading' | 'result'
type Tone = 'friend' | 'warm' | 'brief'

const TONES: { key: Tone; label: string }[] = [
  { key: 'friend', label: '像老朋友' },
  { key: 'warm',   label: '更温暖一点' },
  { key: 'brief',  label: '短一点就好' },
]

function detectLang(name: string): 'en' | 'zh' {
  return /[a-zA-Z]/.test(name) && !/[\u4e00-\u9fa5]/.test(name) ? 'en' : 'zh'
}

export default function ChatPage() {
  const [step, setStep]           = useState<Step>('ask')
  const [name, setName]           = useState('')
  const [tone, setTone]           = useState<Tone>('friend')
  const [message, setMessage]     = useState('')
  const [copied, setCopied]       = useState(false)
  const [regenLoading, setRegenLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const lang = detectLang(name)

  useEffect(() => {
    if (step === 'ask') inputRef.current?.focus()
  }, [step])

  // ── 生成草稿 ──
  async function generate(targetName: string, targetTone: Tone) {
    try {
      const res = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: targetName,
          lang: detectLang(targetName),
          tone: targetTone,
        }),
      })
      const data = await res.json()
      return data.message as string
    } catch {
      return detectLang(targetName) === 'en'
        ? `Hey ${targetName} — randomly thought of you today. Hope you're doing well.`
        : `${targetName}，最近突然想到你，不知道你现在怎么样。`
    }
  }

  // ── 开始 ──
  async function handleStart() {
    if (!name.trim()) return
    setStep('loading')
    const msg = await generate(name.trim(), tone)
    setMessage(msg)
    setStep('result')
  }

  // ── 换语气 ──
  async function handleTone(t: Tone) {
    setTone(t)
    setRegenLoading(true)
    const msg = await generate(name.trim(), t)
    setMessage(msg)
    setRegenLoading(false)
    setCopied(false)
  }

  // ── 换一个 ──
  async function handleRegen() {
    setRegenLoading(true)
    const msg = await generate(name.trim(), tone)
    setMessage(msg)
    setRegenLoading(false)
    setCopied(false)
  }

  // ── 复制 ──
  function handleCopy() {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  // ── 重来 ──
  function handleRestart() {
    setName('')
    setTone('friend')
    setMessage('')
    setCopied(false)
    setStep('ask')
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgOrb} />

      {/* 顶栏 */}
      <header className={styles.header}>
        <a href="/" className={styles.back}>← 返回</a>
        <div className={styles.headerTitle}>
          <span className={styles.dot} />
          田螺姑娘在这里
        </div>
        <div />
      </header>

      {/* ── STEP 1: 问题 ── */}
      {step === 'ask' && (
        <div className={styles.stepWrap}>
          <div className={styles.shellIcon}>🐚</div>
          <h2 className={styles.askTitle}>
            {lang === 'en'
              ? 'Is there someone you\'ve been meaning to reach out to?'
              : '你最近有没有一个\n一直想联系、却还没联系的人？'}
          </h2>
          <p className={styles.askHint}>
            {lang === 'en' ? 'Just a name is enough' : '不用想太多，一个名字就够了'}
          </p>
          <input
            ref={inputRef}
            className={styles.nameInput}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder={lang === 'en' ? 'e.g. John / old friend' : '比如：John / 老朋友 / 前同事'}
            maxLength={30}
            autoComplete="off"
          />
          <button
            className={styles.startBtn}
            onClick={handleStart}
            disabled={!name.trim()}
          >
            {lang === 'en' ? 'Write it for me' : '帮我写'}
          </button>
        </div>
      )}

      {/* ── STEP 2: 生成中 ── */}
      {step === 'loading' && (
        <div className={styles.stepWrap}>
          <div className={`${styles.shellIcon} ${styles.shellBreathing}`}>🐚</div>
          <p className={styles.loadingText}>
            {lang === 'en' ? 'Finding the right words…' : '她在想该怎么开口…'}
          </p>
          <p className={styles.loadingSub}>
            {lang === 'en' ? 'Helping you with the first line' : '帮你把第一句话想好'}
          </p>
        </div>
      )}

      {/* ── STEP 3: 结果 ── */}
      {step === 'result' && (
        <div className={styles.stepWrap}>
          <p className={styles.resultLabel}>
            {lang === 'en'
              ? `She wrote this for ${name}`
              : `她帮你给 ${name} 想好了`}
          </p>

          {/* 消息卡片 */}
          <div className={`${styles.messageCard} ${regenLoading ? styles.cardLoading : ''}`}>
            <span className={styles.cardQuote}>"</span>
            <p className={styles.messageText}>
              {regenLoading ? '…' : message}
            </p>
          </div>

          {/* 主操作 */}
          <div className={styles.actions}>
            <button
              className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
              onClick={handleCopy}
              disabled={regenLoading}
            >
              {copied
                ? (lang === 'en' ? '✓ Copied' : '✓ 已复制')
                : (lang === 'en' ? 'Copy message' : '复制这条消息')}
            </button>
            <button
              className={styles.regenBtn}
              onClick={handleRegen}
              disabled={regenLoading}
            >
              {regenLoading
                ? (lang === 'en' ? 'Rewriting…' : '换一个…')
                : (lang === 'en' ? 'Try another' : '换一个语气')}
            </button>
          </div>

          {/* 语气切换 */}
          <div className={styles.toneRow}>
            {TONES.map(t => (
              <button
                key={t.key}
                className={`${styles.toneBtn} ${tone === t.key ? styles.toneBtnActive : ''}`}
                onClick={() => handleTone(t.key)}
                disabled={regenLoading}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 钩子 */}
          <p className={styles.hook}>
            {lang === 'en'
              ? 'She can help with things like this, whenever you need.'
              : '以后这种事，我可以帮你慢慢处理。'}
          </p>

          <button className={styles.restartBtn} onClick={handleRestart}>
            {lang === 'en' ? 'Try someone else' : '换一个人试试'}
          </button>
        </div>
      )}
    </div>
  )
}
