import { useRef, useState } from 'react'

/* ── ⚽ Penalty Shootout — beat goalkeeper Ujjal ─────────── */

const COLS = [18, 50, 82]
const ROWS = [32, 74]
const LABELS = ['↖', '↑', '↗', '↙', '↓', '↘']
const ZONES = []
ROWS.forEach((y, r) => {
  COLS.forEach((x, c) => {
    const id = r * 3 + c
    ZONES.push({ id, x, y, label: LABELS[id] })
  })
})
const KICKS = 5

export default function Penalty() {
  const [kicksTaken, setKicksTaken] = useState(0)
  const [goals, setGoals] = useState(0)
  const [results, setResults] = useState([]) // 'goal' | 'saved'
  const [phase, setPhase] = useState('aim') // aim | flying | done
  const [ball, setBall] = useState({ x: 50, y: 112 })
  const [keeper, setKeeper] = useState({ x: 50, y: 52, dive: false })
  const [message, setMessage] = useState('Pick a corner and shoot! Ujjal is in goal 🧤')
  const timers = useRef([])

  function later(fn, ms) {
    timers.current.push(setTimeout(fn, ms))
  }

  function shoot(zone) {
    if (phase !== 'aim') return
    // Ujjal reads you 42% of the time, otherwise dives somewhere else
    const diveId =
      Math.random() < 0.42 ? zone.id : (zone.id + 1 + Math.floor(Math.random() * 5)) % 6
    const cpuZone = ZONES[diveId]

    setPhase('flying')
    setBall({ x: zone.x, y: zone.y })
    setKeeper({ x: cpuZone.x, y: cpuZone.y, dive: true })

    later(() => {
      const saved = cpuZone.id === zone.id
      const taken = kicksTaken + 1
      const goalsNow = goals + (saved ? 0 : 1)
      setKicksTaken(taken)
      setGoals(goalsNow)
      setResults((r) => [...r, saved ? 'saved' : 'goal'])

      if (saved) setMessage('🧤 SAVED! Ujjal: "not today, my friend!"')
      else setMessage('⚽ GOOOAL! Ujjal shakes his head 😅')

      if (taken >= KICKS) {
        later(() => {
          setPhase('done')
          setMessage(
            goalsNow === 5
              ? '🤯 5/5! Ujjal: "are you a penalty machine?!"'
              : goalsNow >= 3
                ? `🤝 ${goalsNow}/5 — solid! Ujjal respects that.`
                : `😎 ${goalsNow}/5 — Ujjal: "goalkeeping is my real talent!"`
          )
        }, 1200)
      } else {
        later(() => {
          setBall({ x: 50, y: 112 })
          setKeeper({ x: 50, y: 52, dive: false })
          setPhase('aim')
        }, 1300)
      }
    }, 750)
  }

  function reset() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setKicksTaken(0)
    setGoals(0)
    setResults([])
    setPhase('aim')
    setBall({ x: 50, y: 112 })
    setKeeper({ x: 50, y: 52, dive: false })
    setMessage('Pick a corner and shoot! Ujjal is in goal 🧤')
  }

  const diveAngle = keeper.dive ? (keeper.x < 50 ? -28 : keeper.x > 50 ? 28 : 0) : 0

  return (
    <div>
      <div className="game-players">
        <span className="player-chip you">You ⚽</span>
        <span className="vs">vs</span>
        <span className="player-chip cpu">🧤 Goalkeeper Ujjal</span>
      </div>

      <div className="arch-stats">
        <span>
          Kick <strong>{Math.min(kicksTaken + 1, KICKS)}/{KICKS}</strong>
        </span>
        <span>
          Goals <strong>{goals}</strong>
        </span>
      </div>

      <div className="penalty-stage">
        <div className="goal-frame">
          <span
            className="keeper"
            style={{
              left: `${keeper.x}%`,
              top: `${keeper.y}%`,
              transform: `translate(-50%, -50%) rotate(${diveAngle}deg)`,
            }}
            aria-hidden="true"
          >
            🧤
          </span>
          <span
            className="ball"
            style={{ left: `${ball.x}%`, top: `${ball.y}%` }}
            aria-hidden="true"
          >
            ⚽
          </span>
          <div className="zone-grid">
            {ZONES.map((zone) => (
              <button
                key={zone.id}
                type="button"
                className="zone-btn"
                disabled={phase !== 'aim'}
                onClick={() => shoot(zone)}
                aria-label={`Shoot ${zone.label}`}
              >
                {zone.label}
              </button>
            ))}
          </div>
        </div>
        <div className="penalty-ground" />
      </div>

      <div className="penalty-dots" aria-hidden="true">
        {Array.from({ length: KICKS }, (_, i) => (
          <span key={i}>
            {results[i] === 'goal' ? '⚽' : results[i] === 'saved' ? '🧤' : '⚪'}
          </span>
        ))}
      </div>

      <p className="game-message">{message}</p>

      {phase === 'done' && (
        <button type="button" className="reset-btn" onClick={reset}>
          🔄 New shootout
        </button>
      )}
    </div>
  )
}
