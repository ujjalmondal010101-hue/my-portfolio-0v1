import { Link } from 'react-router-dom'

export default function GameCard({ game, index = 0 }) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="game-card reveal"
      style={{ '--reveal-delay': `${index * 70}ms` }}
    >
      <span className="game-card-emoji" aria-hidden="true">
        {game.emoji}
      </span>
      <h3>{game.name}</h3>
      <p>{game.tagline}</p>
      <span className="game-card-play">
        Play now <span className="arrow">→</span>
      </span>
    </Link>
  )
}
