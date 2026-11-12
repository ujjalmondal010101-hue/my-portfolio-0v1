import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GAMES } from '../games/registry.js'
import GameCard from '../components/GameCard.jsx'

export default function GamesMenu() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main>
      <section className="games-page">
        <div className="container">
          <div className="section-head">
            <span className="hand">pick your game</span>
            <h2>
              Mini Games <span className="grad-text">Arena</span> 🎮
            </h2>
            <p className="section-sub">
              Five games, one computer player — <strong>Ujjal</strong>. Choose
              your battlefield!
            </p>
          </div>

          <div className="games-grid">
            {GAMES.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          <div className="games-page-back">
            <Link to="/" className="btn btn-ghost">
              ◀ Back to portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
