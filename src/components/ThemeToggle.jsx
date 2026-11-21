import { useSettings } from '../context/Settings.jsx'

export default function ThemeToggle() {
  const { settings, update } = useSettings()
  const isDark = settings.theme === 'dark'

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'dark' : ''}`}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => update({ theme: isDark ? 'light' : 'dark' })}
    >
      <span className="theme-knob" aria-hidden="true">
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
