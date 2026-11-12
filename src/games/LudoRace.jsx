import { useEffect, useRef, useState } from 'react'

/* ── 🎲 Ludo Race — race Ujjal to the finish ────────────── */

const TILES = 28
const LAST = TILES - 1
const SAFE = [0, 9, 18] // ⭐ safe squares — no captures here

function rollDie() {
  return 1 + Math.floor(Math.random() * 6)
}

export default function LudoRace() {
  const [pos, setPos] = useState({ you: 0, ujjal: 0 })
  const [turn, setTurn] = useState('you')
  const [dice, setDice] = useState(null)
  const [busy, setBusy] = useState(false)
  const [winner, setWinner] = useState(null)
  const [message, setMessage] = useState('Roll the dice! First to reach the 🏁 wins.')
  const posRef = useRef(pos)

  useEffect(() => {
    posRef.current = pos
  }, [pos])

  function applyMove(who, v) {
    const p = Math.min(posRef.current[who] + v, LAST)
    const next = { ...posRef.current, [who]: p }
    let captured = false
    const other = who === 'you' ? 'ujjal' : 'you'
    if (p > 0 && !SAFE.includes(p) && next[other] === p) {
      next[other] = 0
      captured = true
    }
    return { next, captured, win: p === LAST }
  }

  function youRoll() {
    if (turn !== 'you' || busy || winner) return
    const v = rollDie()
    setDice(v)
    setBusy(true)

    setTimeout(() => {
      const { next, captured, win } = applyMove('you', v)
      setPos(next)

      if (win) {
        setWinner('you')
        setMessage('🏆 YOU WIN! Ujjal: "ok, one more game, please!"')
        setBusy(false)
        return
      }
      if (captured) setMessage('💥 You caught Ujjal — back to start for him!')
      else if (v === 6) setMessage('🎲 Six! Bonus roll!')
      else setMessage(`You moved ${v} step${v > 1 ? 's' : ''}.`)

      if (v === 6 && !captured) {
        setBusy(false) // six = roll again
        return
      }
      setTimeout(ujjalRoll, 950)
    }, 420)
  }

  function ujjalRoll() {
    const v = rollDie()
    setDice(v)
    const { next, captured, win } = applyMove('ujjal', v)
    setPos(next)

    if (win) {
      setWinner('ujjal')
      setMessage('🤖 Ujjal wins! "GG — rematch?"')
      setBusy(false)
      setTurn('you')
      return
    }
    if (captured) setMessage('😱 Ujjal caught you — back to start!')
    else setMessage(`Ujjal rolled ${v}.`)

    if (v === 6) {
      setTimeout(ujjalRoll, 950) // ujjal keeps rolling
      return
    }
    setTurn('you')
    setBusy(false)
  }

  function reset() {
    setPos({ you: 0, ujjal: 0 })
    setTurn('you')
    setDice(null)
    setBusy(false)
    setWinner(null)
    setMessage('Roll the dice! First to reach the 🏁 wins.')
  }

  return (
    <div>
      <div className="game-players">
        <span className="player-chip you">
          <span className="ludo-token you" aria-hidden="true">🙂</span> You
        </span>
        <span className="vs">vs</span>
        <span className="player-chip cpu">
          <span className="ludo-token ujjal" aria-hidden="true">🤖</span> Ujjal
        </span>
      </div>

      <div className="ludo-board">
        {Array.from({ length: TILES }, (_, i) => {
          const tokensHere = ['you', 'ujjal'].filter((w) => pos[w] === i)
          return (
            <div
              key={i}
              className={`ludo-tile ${SAFE.includes(i) ? 'safe' : ''} ${
                i === LAST ? 'finish' : ''
              }`}
            >
              <span className="ludo-mark" aria-hidden="true">
                {i === LAST ? '🏁' : SAFE.includes(i) ? '⭐' : i + 1}
              </span>
              <span className="ludo-tokens">
                {tokensHere.map((w) => (
                  <span key={w} className={`ludo-token ${w}`} aria-hidden="true">
                    {w === 'you' ? '🙂' : '🤖'}
                  </span>
                ))}
              </span>
            </div>
          )
        })}
      </div>

      <div className="ludo-controls">
        <div className="ludo-die" aria-live="polite">
          {dice ? `🎲 ${dice}` : '🎲 —'}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          disabled={turn !== 'you' || busy || winner}
          onClick={youRoll}
        >
          {turn === 'you' && !winner ? '🎲 Roll dice' : 'Ujjal playing…'}
        </button>
      </div>

      <p className="game-message">{message}</p>

      {(winner || pos.you > 0 || pos.ujjal > 0) && (
        <button type="button" className="reset-btn" onClick={reset}>
          🔄 Restart race
        </button>
      )}
    </div>
  )
}
