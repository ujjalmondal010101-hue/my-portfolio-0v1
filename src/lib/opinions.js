// ─────────────────────────────────────────────────────────────
//  Visitors' Opinions — storage helpers
//
//  Text is saved in localStorage. Files are saved in IndexedDB
//  (they are too big for localStorage). Both live only on THIS
//  device/browser — nothing is sent to a server.
// ─────────────────────────────────────────────────────────────

const LS_KEY = 'um-opinions'
const DB_NAME = 'um-opinions-db'
const DB_VERSION = 1
const FILE_STORE = 'files'

export const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8 MB

export function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `op-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

// ── localStorage (text) ──────────────────────────────────────

export function listOpinions() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    if (!Array.isArray(raw)) return []
    return raw.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  } catch {
    return []
  }
}

function writeAll(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

export function countOpinions() {
  return listOpinions().length
}

// ── IndexedDB (files) ────────────────────────────────────────

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(FILE_STORE)) {
        db.createObjectStore(FILE_STORE)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function withStore(mode, run) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(FILE_STORE, mode)
        let result
        try {
          result = run(tx.objectStore(FILE_STORE))
        } catch (error) {
          db.close()
          reject(error)
          return
        }
        tx.oncomplete = () => {
          db.close()
          resolve(result)
        }
        tx.onerror = () => {
          db.close()
          reject(tx.error)
        }
        tx.onabort = () => {
          db.close()
          reject(tx.error)
        }
      })
  )
}

function putFile(id, file) {
  return withStore('readwrite', (store) =>
    store.put({ blob: file, name: file.name, type: file.type, size: file.size }, id)
  )
}

function removeFile(id) {
  return withStore('readwrite', (store) => store.delete(id))
}

export async function getFile(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILE_STORE, 'readonly')
    const request = tx.objectStore(FILE_STORE).get(id)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => db.close()
  })
}

// ── Public API ───────────────────────────────────────────────

/**
 * Saves one opinion. If a file is given it is stored in IndexedDB.
 * Returns { opinion, fileSaved, fileError }.
 */
export async function saveOpinion({ name, email, rating, message, file }) {
  const id = newId()
  let storedFile = null
  let fileError = ''

  if (file) {
    try {
      await putFile(id, file)
      storedFile = { name: file.name, type: file.type, size: file.size }
    } catch (error) {
      fileError = error?.message || 'Could not save the file on this device.'
    }
  }

  const opinion = {
    id,
    name: name.trim(),
    email: email.trim(),
    rating: Number(rating) || 0,
    message: message.trim(),
    createdAt: new Date().toISOString(),
    file: storedFile,
  }

  const all = listOpinions()
  all.unshift(opinion)
  writeAll(all)

  return { opinion, fileSaved: !!storedFile, fileError }
}

export async function deleteOpinion(id) {
  const all = listOpinions().filter((item) => item.id !== id)
  writeAll(all)
  try {
    await removeFile(id)
  } catch {
    /* file may not exist — that's fine */
  }
}

export function clearOpinions() {
  writeAll([])
}

/** Makes a temporary download URL for a stored file. */
export async function fileUrl(id) {
  const record = await getFile(id)
  if (!record?.blob) return null
  return {
    url: URL.createObjectURL(record.blob),
    name: record.name || 'attachment',
  }
}
