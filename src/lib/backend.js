// ─────────────────────────────────────────────────────────────
//  Opinions backend
//
//  Uses FormSubmit (https://formsubmit.co) — a free, no-signup
//  form backend. Every opinion (with the file attached) is
//  emailed straight to Ujjal's private inbox. Nothing is stored
//  on a public server and the site itself still stays static.
//
//  ONE-TIME SETUP: the first submission sends an "Activate Form"
//  email to the owner. Click that link once and everything works.
// ─────────────────────────────────────────────────────────────

import { owner } from '../data.js'

const TIMEOUT_MS = 30000

export function backendReady() {
  return owner.opinionsBackend !== 'off' && !!owner.opinionsEmail
}

function endpoint() {
  return `https://formsubmit.co/ajax/${encodeURIComponent(owner.opinionsEmail)}`
}

/**
 * Sends one opinion to the owner's email inbox.
 * Always resolves to { status, message } where status is:
 *   'sent'    — delivered to the inbox
 *   'pending' — owner still needs to click the activation email
 *   'failed'  — network/service problem (caller should offer a fallback)
 */
export async function sendOpinion({ name, email, rating, message, file, page }) {
  if (!backendReady()) {
    return { status: 'failed', message: 'The opinions backend is turned off.' }
  }

  const data = new FormData()
  data.append('name', name)
  if (email) data.append('email', email)
  data.append('rating', rating ? `${'★'.repeat(rating)} (${rating}/5)` : 'No rating')
  data.append('opinion', message)
  data.append('sent_from', page || 'portfolio')
  data.append('_subject', `New visitor opinion from ${name}`)
  data.append('_template', 'table')
  data.append('_honey', '')
  if (file) data.append('attachment', file, file.name)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(endpoint(), {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    let payload = {}
    try {
      payload = await response.json()
    } catch {
      payload = {}
    }

    if (!response.ok) {
      return {
        status: 'failed',
        message: payload.message || `The server answered with ${response.status}.`,
      }
    }

    if (String(payload.success) === 'true') {
      return { status: 'sent', message: payload.message || 'Delivered.' }
    }

    if (/activat/i.test(payload.message || '')) {
      return { status: 'pending', message: payload.message }
    }

    return { status: 'failed', message: payload.message || 'The service rejected the form.' }
  } catch (error) {
    const aborted = error?.name === 'AbortError'
    return {
      status: 'failed',
      message: aborted ? 'The request took too long.' : 'Network problem — are you online?',
    }
  } finally {
    clearTimeout(timer)
  }
}

// A note for visitors about where their words go (also used in the UI).
export const DELIVERY_NOTE =
  'Your note and file are emailed straight to Ujjal’s private inbox. They are never published on this website.'
