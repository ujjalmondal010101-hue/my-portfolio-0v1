import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { owner } from '../data.js'
import { deleteOpinion, fileUrl, formatBytes, formatDate, listOpinions } from '../lib/opinions.js'

const SESSION_KEY = 'um-owner-unlocked'

export default function Inbox() {
  const navigate = useNavigate()
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [items, setItems] = useState(() => listOpinions())
  const [busyId, setBusyId] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(''), 2600)
    return () => clearTimeout(timer)
  }, [notice])

  function unlock(event) {
    event.preventDefault()
    if (pin.trim() === String(owner.pin)) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setUnlocked(true)
      setPinError('')
      setPin('')
      setItems(listOpinions())
      return
    }
    setPinError('That PIN is not right. Try again.')
  }

  function lock() {
    sessionStorage.removeItem(SESSION_KEY)
    setUnlocked(false)
  }

  async function download(item) {
    if (!item.file) return
    setBusyId(item.id)
    try {
      const file = await fileUrl(item.id)
      if (!file) {
        setNotice('That file is no longer stored on this device.')
        return
      }
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(file.url), 4000)
    } catch {
      setNotice('Could not open that file.')
    } finally {
      setBusyId('')
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete the opinion from ${item.name}? This cannot be undone.`)) {
      return
    }
    await deleteOpinion(item.id)
    setItems(listOpinions())
    setNotice('Opinion deleted.')
  }

  async function removeAll() {
    if (!items.length) return
    if (!window.confirm(`Delete all ${items.length} opinions from this device?`)) return
    for (const item of items) {
      // eslint-disable-next-line no-await-in-loop
      await deleteOpinion(item.id)
    }
    setItems([])
    setNotice('Inbox cleared.')
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ujjal-opinions-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
  }

  if (!unlocked) {
    return (
      <main>
        <section className="games-page">
          <div className="container opinions-narrow">
            <Link to="/" className="back-link">
              ◀ Back to portfolio
            </Link>

            <div className="lock-card">
              <span className="lock-emoji" aria-hidden="true">
                🔒
              </span>
              <h1>Owner Inbox</h1>
              <p>
                This area is private. Enter your PIN to read the opinions and
                open the files visitors sent you.
              </p>

              <form className="lock-form" onSubmit={unlock}>
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="current-password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value)
                    setPinError('')
                  }}
                  placeholder="Enter PIN"
                  aria-label="Owner PIN"
                  aria-invalid={!!pinError}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary">
                  Unlock
                </button>
              </form>

              {pinError && <p className="field-error">{pinError}</p>}

              <p className="lock-hint">
                Forgotten it? The PIN lives in <code>src/data.js</code> under{' '}
                <code>owner.pin</code>.
              </p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="games-page">
        <div className="container opinions-wide">
          <div className="inbox-head">
            <div>
              <Link to="/" className="back-link">
                ◀ Back to portfolio
              </Link>
              <h1>
                Owner <span className="grad-text">Inbox</span> 🔐
              </h1>
              <p>
                {items.length
                  ? `${items.length} opinion${items.length === 1 ? '' : 's'} saved on this device.`
                  : 'No opinions saved on this device yet.'}
              </p>
            </div>

            <div className="inbox-tools">
              <button type="button" className="btn btn-ghost" onClick={() => setItems(listOpinions())}>
                ↻ Refresh
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={exportJson}
                disabled={!items.length}
              >
                ⬇ Export
              </button>
              <button type="button" className="btn btn-ghost" onClick={lock}>
                Lock
              </button>
            </div>
          </div>

          <div className="inbox-note">
            <b>How this works:</b> opinions land here when someone submits the form
            on this browser. Files are stored privately in this browser — never on
            a public server. To receive notes from visitors on other devices, send
            them your WhatsApp link from the form, or connect a free backend.
          </div>

          {notice && <div className="inbox-toast">{notice}</div>}

          {!items.length ? (
            <div className="inbox-empty">
              <span aria-hidden="true">📭</span>
              <h2>The inbox is empty</h2>
              <p>
                Submit a test opinion from the visitors&apos; form — then come back
                here and it will appear.
              </p>
              <div className="inbox-empty-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate('/opinions')}
                >
                  ✍️ Open the opinion form
                </button>
              </div>
            </div>
          ) : (
            <>
              <ul className="inbox-list">
                {items.map((item) => (
                  <li key={item.id} className="inbox-card">
                    <div className="inbox-card-head">
                      <div className="inbox-avatar" aria-hidden="true">
                        {(item.name || '?').trim().charAt(0).toUpperCase()}
                      </div>
                      <div className="inbox-who">
                        <b>{item.name}</b>
                        <small>{formatDate(item.createdAt)}</small>
                        {item.email && (
                          <a href={`mailto:${item.email}`} className="inbox-mail">
                            {item.email}
                          </a>
                        )}
                      </div>
                      <div className="inbox-rating" aria-label={`${item.rating} out of 5 stars`}>
                        {item.rating ? '★'.repeat(item.rating) : <span className="no-rating">no rating</span>}
                      </div>
                    </div>

                    <p className="inbox-message">{item.message}</p>

                    <div className="inbox-actions">
                      {item.file ? (
                        <button
                          type="button"
                          className="file-btn"
                          onClick={() => download(item)}
                          disabled={busyId === item.id}
                        >
                          📎 {item.file.name}
                          <small>{formatBytes(item.file.size)}</small>
                          <b>{busyId === item.id ? 'opening…' : 'download'}</b>
                        </button>
                      ) : (
                        <span className="no-file">No file attached</span>
                      )}

                      <button type="button" className="delete-btn" onClick={() => remove(item)}>
                        🗑 Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="inbox-footer">
                <button type="button" className="link-btn danger" onClick={removeAll}>
                  Delete all opinions
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
