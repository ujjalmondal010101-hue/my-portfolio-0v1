import { createContext, useContext, useEffect, useState } from 'react'

const SettingsContext = createContext(null)

const DEFAULTS = {
  theme: null,
  accent: 'violet',
  motion: true,
  bigText: false,
}

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem('um-settings')) || {}
  } catch {
    return {}
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = loadSaved()
    const legacyTheme = localStorage.getItem('theme')
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    return {
      ...DEFAULTS,
      ...saved,
      theme:
        saved.theme === 'light' || saved.theme === 'dark'
          ? saved.theme
          : legacyTheme === 'light' || legacyTheme === 'dark'
            ? legacyTheme
            : systemTheme,
      accent: saved.accent || 'violet',
      motion: saved.motion !== false,
      bigText: !!saved.bigText,
    }
  })

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = settings.theme
    root.dataset.accent = settings.accent
    root.classList.toggle('motion-off', !settings.motion)
    root.classList.toggle('big-text', settings.bigText)
    localStorage.setItem('um-settings', JSON.stringify(settings))
    localStorage.setItem('theme', settings.theme)
  }, [settings])

  const update = (patch) => setSettings((s) => ({ ...s, ...patch }))

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
