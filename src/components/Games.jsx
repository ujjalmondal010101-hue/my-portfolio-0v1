import { Link } from 'react-router-dom'
import { GAMES } from '../games/registry.js'
import GameCard from './GameCard.jsx'

export default function Games() {
  return (
    <section className="section" id="games">
      <div className="container">
        <div className="section-head">
          <span className="hand">challenge me — if you dare 😏</span>
          <h2>
            Mini <span className="grad-text">Games</span>
          </h2>
          <p className="section-sub">
            Take a break from scrolling — pick a game and play against
            <strong> Ujjal</strong>, the computer player. Each game opens on
            its own page!
          </p>
        </div>

        <div className="games-grid">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        <div className="contact-cta">
          <Link to="/games" className="btn btn-primary">
            🎮 Open the Games Arena
          </Link>
        </div>
      </div>
    </section>
  )
}
