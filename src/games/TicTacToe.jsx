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

export default function TicTacToe() {
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
