import { useState } from 'react'

/* ── Rock · Paper · Scissors vs Ujjal ───────────────────── */

const MOVES = [
  { key: 'rock', emoji: '✊', name: 'Rock' },
  { key: 'paper', emoji: '✋', name: 'Paper' },
  { key: 'scissors', emoji: '✌️', name: 'Scissors' },
]

const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' }

export default function Rps() {
  const [scores, setScores] = useState({ you: 0, ujjal: 0, draws: 0 })
  const [round, setRound] = useState(null)
  const [message, setMessage] = useState('Pick your move — Ujjal is ready! 🤖')

  function play(yourKey) {
    const cpu = MOVES[Math.floor(Math.random() * MOVES.length)]
    const yours = MOVES.find((m) => m.key === yourKey)

    let result
    let line
    if (yourKey === cpu.key) {
      result = 'draws'
      line = '🤝 Ujjal: "great minds think alike!"'
    } else if (BEATS[yourKey] === cpu.key) {
      result = 'you'
      line = `🎉 You win! Ujjal: "lucky shot, ${yours.name.toLowerCase()} player!"`
    } else {
      result = 'ujjal'
      line = '😎 Ujjal wins! "I can read your mind!"'
    }

    setScores((s) => ({ ...s, [result]: s[result] + 1 }))
    setRound({ you: yours, cpu })
    setMessage(line)
  }

  function reset() {
    setScores({ you: 0, ujjal: 0, draws: 0 })
    setRound(null)
    setMessage('Score cleared — rematch time! 🤖')
  }

  return (
    <div>
      <div className="game-players">
        <span className="player-chip you">You</span>
        <span className="vs">vs</span>
        <span className="player-chip cpu">🤖 Ujjal</span>
      </div>

      <div className="score-board">
        <span>
          You <strong>{scores.you}</strong>
        </span>
        <span>
          Draws <strong>{scores.draws}</strong>
        </span>
        <span>
          Ujjal <strong>{scores.ujjal}</strong>
        </span>
      </div>

      <div className="rps-hands">
        <span className="rps-hand">
          <span aria-hidden="true">{round ? round.you.emoji : '❔'}</span>
          <small>{round ? round.you.name : 'you'}</small>
        </span>
        <span className="rps-vs" aria-hidden="true">⚡</span>
        <span className="rps-hand">
          <span aria-hidden="true">{round ? round.cpu.emoji : '❔'}</span>
          <small>{round ? `Ujjal · ${round.cpu.name}` : 'ujjal'}</small>
        </span>
      </div>

      <p className="game-message">{message}</p>

      <div className="rps-buttons">
        {MOVES.map((move) => (
          <button
            key={move.key}
            type="button"
            className="rps-btn"
            aria-label={`Play ${move.name}`}
            onClick={() => play(move.key)}
          >
            {move.emoji}
          </button>
        ))}
      </div>

      <button type="button" className="reset-btn" onClick={reset}>
        🔄 Reset score
      </button>
    </div>
  )
}
