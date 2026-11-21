import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../data.js'
import {
  MAX_FILE_BYTES,
  formatBytes,
  saveOpinion,
} from '../lib/opinions.js'
import { sendOpinion } from '../lib/backend.js'
import { useReveal } from '../hooks/useReveal.js'

const EMPTY = { name: '', email: '', rating: 0, message: '' }

function buildShareText(opinion) {
  const lines = [
    'New opinion for Ujjal 💬',
    '',
    `Name: ${opinion.name}`,
    opinion.email ? `Email: ${opinion.email}` : null,
    opinion.rating ? `Rating: ${'★'.repeat(opinion.rating)} (${opinion.rating}/5)` : null,
    `Message: ${opinion.message}`,
    opinion.file
      ? `Attachment: ${opinion.file.name} (${formatBytes(opinion.file.size)}) — attaching it here too.`
      : null,
  ]
  return lines.filter((line) => line !== null).join('\n')
}

function Stars({ value, onChange }) {
  return (
    <div className="stars" role="radiogroup" aria-label="Rate Ujjal's work">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          className={`star ${star <= value ? 'on' : ''}`}
          onClick={() => onChange(value === star ? 0 : star)}
        >
          ★
        </button>
      ))}
      <span className="stars-label">
        {value ? `${value} / 5` : 'tap to rate (optional)'}
      </span>
    </div>
  )
}

export default function OpinionsPage() {
  useReveal()

  const [form, setForm] = useState(EMPTY)
  const [consent, setConsent] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [dragging, setDragging] = useState(false)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const fileRef = useRef(null)
  const copyTimer = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) {
      setPreview('')
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  function update(patch) {
    setForm((current) => ({ ...current, ...patch }))
    setErrors((current) => {
      const next = { ...current }
      Object.keys(patch).forEach((key) => delete next[key])
      return next
    })
  }

  function pickFile(selected) {
    if (!selected) return
    if (selected.size > MAX_FILE_BYTES) {
      setErrors((current) => ({
        ...current,
        file: `That file is too big (${formatBytes(selected.size)}). Please pick one under 8 MB.`,
      }))
      return
    }
    setErrors((current) => {
      const next = { ...current }
      delete next.file
      return next
    })
    setFile(selected)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = {}
    if (form.name.trim().length < 2) found.name = 'Please tell me your name.'
    if (form.message.trim().length < 10) {
      found.message = 'Write at least a sentence (10+ characters) so I know what you think.'
    }
    if (!consent) found.consent = 'Please tick the box so I know it is okay to read your note.'
    setErrors(found)
    if (Object.keys(found).length) return

    setBusy(true)
    try {
      const saved = await saveOpinion({ ...form, file })
      const delivery = await sendOpinion({
        name: form.name,
        email: form.email,
        rating: form.rating,
        message: form.message,
        file,
        page: `${window.location.origin}${window.location.pathname}#/opinions`,
      })
      setResult({ ...saved, delivery })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setErrors({ form: error?.message || 'Something went wrong. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  function writeAnother() {
    setForm(EMPTY)
    setConsent(false)
    setFile(null)
    setErrors({})
    setResult(null)
    setCopied(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function copyMessage() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(buildShareText(result.opinion))
      setCopied(true)
      copyTimer.current = setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const opinion = result?.opinion
  const delivered = result?.delivery?.status === 'sent'
  const shareText = opinion ? buildShareText(opinion) : ''
  const whatsappHref = opinion
    ? `${profile.whatsapp}?text=${encodeURIComponent(shareText)}`
    : '#'
  const mailHref = opinion
    ? `mailto:${profile.email}?subject=${encodeURIComponent(
        `Opinion from ${opinion.name}`
      )}&body=${encodeURIComponent(shareText)}`
    : '#'

  return (
    <main>
      <section className="games-page opinions-page">
        <div className="container opinions-narrow">
          <Link to="/" className="back-link reveal">
            ◀ Back to portfolio
          </Link>

          <div className="section-head reveal">
            <span className="hand">your words, my fuel ✨</span>
            <h1 className="opinions-title">
              Visitors&apos; <span className="grad-text">Opinions</span>
            </h1>
            <p className="section-sub">
              Tell me what you think of my videos, writing or the games. Rate me,
              leave a message, and attach a file if you want —{' '}
              <strong>only I can open what you send.</strong>
            </p>
          </div>

          {!opinion && (
            <form className="opinion-form reveal" onSubmit={handleSubmit} noValidate>
              <div className="form-row two-col">
                <label className="field">
                  <span className="field-label">
                    Your name <em>required</em>
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    maxLength={60}
                    placeholder="e.g. Riya from Kolkata"
                    onChange={(e) => update({ name: e.target.value })}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </label>

                <label className="field">
                  <span className="field-label">
                    Email <em>optional, stays private</em>
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    maxLength={120}
                    placeholder="you@example.com"
                    onChange={(e) => update({ email: e.target.value })}
                  />
                </label>
              </div>

              <div className="field">
                <span className="field-label">Your rating</span>
                <Stars value={form.rating} onChange={(rating) => update({ rating })} />
              </div>

              <label className="field">
                <span className="field-label">
                  Your opinion <em>required</em>
                </span>
                <textarea
                  rows={6}
                  value={form.message}
                  maxLength={1200}
                  placeholder="What did you like? What could be better? Any idea for a video?"
                  onChange={(e) => update({ message: e.target.value })}
                  aria-invalid={!!errors.message}
                />
                <span className="field-hint">
                  {form.message.trim().length}/1200 characters
                </span>
                {errors.message && <span className="field-error">{errors.message}</span>}
              </label>

              <div className="field">
                <span className="field-label">
                  Attach a file <em>optional · max 8 MB</em>
                </span>

                {!file ? (
                  <button
                    type="button"
                    className={`dropzone ${dragging ? 'dragging' : ''}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragging(false)
                      pickFile(e.dataTransfer.files?.[0])
                    }}
                  >
                    <span className="dropzone-icon" aria-hidden="true">
                      📎
                    </span>
                    <b>Tap to choose a file</b>
                    <small>or drag &amp; drop — image, PDF, document, anything</small>
                  </button>
                ) : (
                  <div className="file-chip">
                    {preview ? (
                      <img src={preview} alt="" className="file-thumb" />
                    ) : (
                      <span className="file-icon" aria-hidden="true">
                        📄
                      </span>
                    )}
                    <div className="file-meta">
                      <b>{file.name}</b>
                      <small>{formatBytes(file.size)}</small>
                    </div>
                    <button
                      type="button"
                      className="file-remove"
                      aria-label="Remove attached file"
                      onClick={() => setFile(null)}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  onChange={(e) => {
                    pickFile(e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
                {errors.file && <span className="field-error">{errors.file}</span>}
              </div>

              <label className="consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked)
                    setErrors((current) => {
                      if (!current.consent) return current
                      const next = { ...current }
                      delete next.consent
                      return next
                    })
                  }}
                />
                <span>
                  I&apos;m happy for Ujjal to read this. I understand it will not be
                  published on the website.
                </span>
              </label>
              {errors.consent && <span className="field-error">{errors.consent}</span>}
              {errors.form && <span className="field-error">{errors.form}</span>}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? 'Sending…' : '💌 Submit my opinion'}
                </button>
                <Link to="/" className="btn btn-ghost">
                  Cancel
                </Link>
              </div>

              <p className="privacy-note">
                🔒 <b>How it works:</b> your note and file are emailed straight to
                Ujjal&apos;s <b>private inbox</b> — only he can open them. Nothing is
                ever published on this website. A copy is also saved in this
                browser so your words aren&apos;t lost.
              </p>
            </form>
          )}

          {opinion && (
            <div className="opinion-success reveal">
              <span className="success-emoji" aria-hidden="true">
                {delivered ? '🎉' : '💌'}
              </span>
              <h2>Thank you, {opinion.name}!</h2>

              {delivered ? (
                <>
                  <p className="success-delivered">
                    ✅ Your opinion went straight to Ujjal&apos;s private inbox
                    {opinion.file ? ` along with ${opinion.file.name}` : ''}. He
                    will read it soon — nothing is shown on the website.
                  </p>
                  <p className="success-soft">
                    A copy is saved in this browser, so your words aren&apos;t
                    lost.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Your opinion is saved in this browser. Please send it directly
                    too — it&apos;s just one tap:
                  </p>

                  {result?.delivery?.status === 'pending' ? (
                    <p className="success-warn">
                      ⚠️ The owner&apos;s inbox is still finishing its one-time
                      activation, so this copy can&apos;t be delivered
                      automatically yet. Use a button below instead.
                    </p>
                  ) : (
                    <p className="success-warn">
                      ⚠️{' '}
                      {result?.delivery?.message ||
                        'The server could not be reached.'}{' '}
                      Use a button below instead.
                    </p>
                  )}

                  {opinion.file && (
                    <p className="success-warn">
                      📎 You attached <b>{opinion.file.name}</b> — please attach
                      it again inside WhatsApp or your email app before sending.
                    </p>
                  )}

                  <div className="success-share">
                    <a
                      className="btn btn-primary"
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      💬 Send on WhatsApp
                    </a>
                    <a className="btn btn-ghost" href={mailHref}>
                      📧 Send by email
                    </a>
                    <button type="button" className="btn btn-ghost" onClick={copyMessage}>
                      {copied ? '✅ Copied!' : '📋 Copy message'}
                    </button>
                  </div>
                </>
              )}

              <div className="success-recap">
                <div className="success-stars" aria-label={`${opinion.rating} out of 5 stars`}>
                  {opinion.rating ? '★'.repeat(opinion.rating) : '—'}
                  {opinion.rating ? '☆'.repeat(5 - opinion.rating) : ''}
                </div>
                <p>{opinion.message}</p>
              </div>

              <button type="button" className="link-btn" onClick={writeAnother}>
                ✍️ Write another opinion
              </button>
            </div>
          )}

          <div className="opinions-help reveal">
            <div>
              <b>Not sure what to write?</b>
              <p>Ask UM Assistant for ideas — it knows everything about Ujjal.</p>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => window.dispatchEvent(new CustomEvent('um-open-chat'))}
            >
              🤖 Ask the assistant
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
