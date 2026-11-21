import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GAMES } from '../games/registry.js'
import GameCard from '../components/GameCard.jsx'
import { useReveal } from '../hooks/useReveal.js'

export default function GamePage() {
  const { gameId } = useParams()
  const game = GAMES.find((g) => g.id === gameId)

  useReveal()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [gameId])

  if (!game) {
    return (
      <main>
        <section className="games-page">
          <div className="container">
            <div className="section-head reveal">
              <span className="hand">hmm…</span>
              <h2>
                Game <span className="grad-text">not found</span> 🤔
              </h2>
              <p className="section-sub">
                That game does not exist — pick one of these instead!
              </p>
            </div>
            <div className="games-grid">
              {GAMES.map((g, i) => (
                <GameCard key={g.id} game={g} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  const Game = game.component
  const others = GAMES.filter((g) => g.id !== game.id)

  return (
    <main>
      <section className="games-page">
        <div className="container game-page-inner">
          <Link to="/games" className="back-link reveal">
            ◀ All games
          </Link>

          <div className="game-hero reveal">
            <span className="game-hero-emoji" aria-hidden="true">
              {game.emoji}
            </span>
            <h1>{game.name}</h1>
            <p>{game.tagline}</p>
          </div>

          <div className="game-panel reveal" style={{ '--reveal-delay': '120ms' }}>
            <Game />
          </div>

          <div className="more-games reveal">
            <span className="more-label">More games:</span>
            {others.map((g) => (
              <Link key={g.id} to={`/games/${g.id}`} className="games-tab">
                {g.emoji} {g.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
