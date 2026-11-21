import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../context/Settings.jsx'

const ACCENTS = [
  { id: 'violet', label: 'Violet', colors: ['#7c3aed', '#ec4899', '#f97316'] },
  { id: 'ocean', label: 'Ocean', colors: ['#0284c7', '#06b6d4', '#6366f1'] },
  { id: 'sunset', label: 'Sunset', colors: ['#f43f5e', '#f97316', '#eab308'] },
  { id: 'forest', label: 'Forest', colors: ['#059669', '#14b8a6', '#84cc16'] },
]

function Switch({ checked, onChange, label, emoji }) {
  return (
    <div className="settings-row">
      <span className="settings-label">
        {emoji} {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`switch ${checked ? 'on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="switch-knob" />
      </button>
    </div>
  )
}

export default function Customizer() {
  const { settings, update } = useSettings()
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="customizer" ref={boxRef}>
      <button
        type="button"
        className="gear-btn"
        aria-label="Customize appearance"
        aria-expanded={open}
        title="Customize appearance"
        onClick={() => setOpen(!open)}
      >
        ⚙️
      </button>

      {open && (
        <div className="settings-panel" role="dialog" aria-label="Customize appearance">
          <div className="settings-head">
            <h3>✨ Customize</h3>
            <button
              type="button"
              className="settings-close"
              aria-label="Close customization panel"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <Switch
            emoji={settings.theme === 'dark' ? '🌙' : '☀️'}
            label="Dark mode"
            checked={settings.theme === 'dark'}
            onChange={(v) => update({ theme: v ? 'dark' : 'light' })}
          />

          <div className="settings-row settings-col">
            <span className="settings-label">🎨 Color theme</span>
            <div className="swatches">
              {ACCENTS.map((accent) => (
                <button
                  key={accent.id}
                  type="button"
                  className={`swatch ${settings.accent === accent.id ? 'active' : ''}`}
                  aria-label={`${accent.label} color theme`}
                  title={accent.label}
                  style={{
                    background: `linear-gradient(135deg, ${accent.colors.join(', ')})`,
                  }}
                  onClick={() => update({ accent: accent.id })}
                />
              ))}
            </div>
          </div>

          <Switch
            emoji="🎬"
            label="Animations"
            checked={settings.motion}
            onChange={(v) => update({ motion: v })}
          />

          <Switch
            emoji="🔠"
            label="Bigger text"
            checked={settings.bigText}
            onChange={(v) => update({ bigText: v })}
          />

          <button
            type="button"
            className="reset-btn settings-reset"
            onClick={() => update({ accent: 'violet', motion: true, bigText: false })}
          >
            ↺ Reset customization
          </button>
        </div>
      )}
    </div>
  )
}
