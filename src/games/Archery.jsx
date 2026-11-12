import { useEffect, useRef, useState } from 'react'

/* ── 🏹 Archery — time your shot, hit the bullseye ──────── */

const ARROWS = 5
const CENTER = 50

export default function Archery() {
  const [pos, setPos] = useState(CENTER)
  const [arrows, setArrows] = useState([])
  const [best, setBest] = useState(() => Number(localStorage.getItem('archery-best')) || 0)
  const [message, setMessage] = useState(
    'Press SHOOT when the red line is over the gold centre! 🎯'
  )
  const aimRef = useRef({ p: CENTER, d: 1 })

  const done = arrows.length >= ARROWS
  const speed = 0.5 + arrows.length * 0.22 // speeds up with every arrow

  useEffect(() => {
    if (done) return
    const id = setInterval(() => {
      const aim = aimRef.current
      aim.p += aim.d * speed
      if (aim.p >= 96) {
        aim.p = 96
        aim.d = -1
      }
      if (aim.p <= 4) {
        aim.p = 4
        aim.d = 1
      }
      setPos(aim.p)
    }, 16)
    return () => clearInterval(id)
  }, [done, speed])

  function shoot() {
    if (done) return
    const dist = Math.abs(aimRef.current.p - CENTER)
    const points = dist <= 4 ? 10 : dist <= 12 ? 7 : dist <= 22 ? 5 : dist <= 34 ? 3 : 0

    const next = [...arrows, points]
    setArrows(next)

    if (next.length >= ARROWS) {
      const total = next.reduce((a, b) => a + b, 0)
      if (total > best) {
        setBest(total)
        localStorage.setItem('archery-best', String(total))
      }
      setMessage(
        total >= 40
          ? '🏆 Incredible! Ujjal is speechless!'
          : total >= 25
            ? '🎯 Great shooting, archer!'
            : '😅 Ujjal: "maybe try badminton?"'
      )
    } else {
      setMessage(
        points === 10
          ? '🎯 BULLSEYE! 10 points!'
          : points > 0
            ? `+${points} points!`
            : '💨 Missed! Ujjal is giggling!'
      )
    }
  }

  function reset() {
    aimRef.current = { p: CENTER, d: 1 }
    setPos(CENTER)
    setArrows([])
    setMessage('Press SHOOT when the red line is over the gold centre! 🎯')
  }

  const total = arrows.reduce((a, b) => a + b, 0)

  return (
    <div>
      <div className="game-players">
        <span className="player-chip you">🏹 You</span>
        <span className="vs">vs</span>
        <span className="player-chip cpu">🤖 Ujjal (scorekeeper)</span>
      </div>

      <div className="arch-stats">
        <span>
          Arrow <strong>{Math.min(arrows.length + 1, ARROWS)}/{ARROWS}</strong>
        </span>
        <span>
          Score <strong>{total}</strong>
        </span>
        <span>
          Best <strong>{best}</strong>
        </span>
      </div>

      <button
        type="button"
        className="arch-target"
        onClick={shoot}
        disabled={done}
        aria-label="Shoot arrow"
      >
        <span className="arch-crosshair" style={{ left: `${pos}%` }} />
      </button>

      {arrows.length > 0 && (
        <div className="arch-log">
          {arrows.map((points, i) => (
            <span key={i} className={`arch-chip ${points === 10 ? 'gold' : ''}`}>
              {i + 1}: {points === 10 ? '🎯 10' : points > 0 ? `+${points}` : '💨 0'}
            </span>
          ))}
        </div>
      )}

      <p className="game-message">{message}</p>

      {done ? (
        <button type="button" className="reset-btn" onClick={reset}>
          🔄 Shoot again
        </button>
      ) : (
        <button type="button" className="btn btn-primary" onClick={shoot}>
          🏹 SHOOT!
        </button>
      )}
    </div>
  )
}
