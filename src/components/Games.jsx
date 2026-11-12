import { useState } from 'react'

/* ── Tic-Tac-Toe: You (❌) vs Ujjal (⭕) ─────────────────── */

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function winnerOf(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

function cpuMove(board) {
  const empties = board
    .map((cell, i) => (cell ? null : i))
    .filter((i) => i !== null)

  // 1. Win if possible
  for (const i of empties) {
    const test = [...board]
    test[i] = 'O'
    if (winnerOf(test) === 'O') return i
  }
  // 2. Block the player
  for (const i of empties) {
    const test = [...board]
    test[i] = 'X'
    if (winnerOf(test) === 'X') return i
  }
  // 3. Take centre, then a random corner, then anything
  if (!board[4]) return 4
  const corners = [0, 2, 6, 8].filter((i) => !board[i])
  const pool = corners.length ? corners : empties
  return pool[Math.floor(Math.random() * pool.length)]
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [thinking, setThinking] = useState(false)
  const [message, setMessage] = useState('Your turn — you are ❌, Ujjal is ⭕')

  const over = winnerOf(board) !== null || !board.includes(null)

  function place(index) {
    if (board[index] || thinking || over) return

    const next = [...board]
    next[index] = 'X'
    setBoard(next)

    if (winnerOf(next) === 'X') {
      setMessage('🎉 You beat Ujjal! He wants a rematch…')
      return
    }
    if (!next.includes(null)) {
      setMessage('🤝 A draw! Ujjal: "good game, friend!"')
      return
    }

    setThinking(true)
    setMessage('Ujjal is thinking… 🤔')
    setTimeout(() => {
      const afterCpu = [...next]
      const move = cpuMove(afterCpu)
      if (move !== undefined) afterCpu[move] = 'O'
      setBoard(afterCpu)
      setThinking(false)

      if (winnerOf(afterCpu) === 'O') {
        setMessage('😎 Ujjal wins! "Better luck next time!"')
      } else if (!afterCpu.includes(null)) {
        setMessage('🤝 A draw! Ujjal: "good game, friend!"')
      } else {
        setMessage('Your turn ❌')
      }
    }, 550)
  }

  function reset() {
    setBoard(Array(9).fill(null))
    setThinking(false)
    setMessage('Your turn — you are ❌, Ujjal is ⭕')
  }

  return (
    <div>
      <div className="game-players">
        <span className="player-chip you">You ❌</span>
        <span className="vs">vs</span>
        <span className="player-chip cpu">🤖 Ujjal ⭕</span>
      </div>

      <div className="board">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            className="cell"
            disabled={cell !== null || thinking || over}
            onClick={() => place(i)}
          >
            {cell === 'X' ? '❌' : cell === 'O' ? '⭕' : ''}
          </button>
        ))}
      </div>

      <p className="game-message">{message}</p>
      <button type="button" className="reset-btn" onClick={reset}>
        🔄 New game
      </button>
    </div>
  )
}

/* ── Rock · Paper · Scissors vs Ujjal ───────────────────── */

const MOVES = [
  { key: 'rock', emoji: '✊', name: 'Rock' },
  { key: 'paper', emoji: '✋', name: 'Paper' },
  { key: 'scissors', emoji: '✌️', name: 'Scissors' },
]

const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' }

function Rps() {
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

/* ── Games section with tabs ────────────────────────────── */

const TABS = [
  { id: 'tictactoe', label: '⭕ Tic-Tac-Toe' },
  { id: 'rps', label: '✊ Rock·Paper·Scissors' },
]

export default function Games() {
  const [active, setActive] = useState('tictactoe')

  return (
    <section className="section" id="games">
      <div className="container">
        <div className="section-head">
          <span className="hand">challenge me — if you dare 😏</span>
          <h2>
            Mini <span className="grad-text">Games</span>
          </h2>
          <p className="section-sub">
            Take a break from scrolling — play a quick match against
            <strong> Ujjal</strong>, the computer player, right here on the page!
          </p>
        </div>

        <div className="games-wrap">
          <div className="games-tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active === tab.id}
                className={`games-tab ${active === tab.id ? 'active' : ''}`}
                onClick={() => setActive(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="game-panel">
            {active === 'tictactoe' ? <TicTacToe /> : <Rps />}
          </div>
        </div>
      </div>
    </section>
  )
}
