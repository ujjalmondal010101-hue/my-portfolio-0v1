import { useNavigate } from 'react-router-dom'
import { profile } from '../data.js'
import { goToSection } from '../utils/scroll.js'

const chips = [
  { emoji: '🎬', label: 'Creator' },
  { emoji: '✍️', label: 'Writer' },
  { emoji: '🎭', label: 'Actor' },
  { emoji: '⚽', label: 'Footballer' },
]

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-text">
          <p className="hero-hi">👋 Hey, I&apos;m</p>
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-tagline">{profile.tagline}</p>
          <p className="hero-sub">{profile.heroSub}</p>
          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href={profile.youtube}
              target="_blank"
              rel="noreferrer"
            >
              🎬 Watch my videos
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => goToSection(navigate, '#contact')}
            >
              Get in touch
            </button>
          </div>
        </div>

        <div className="hero-photo-wrap">
          <div className="hero-photo">
            <img src={profile.photo} alt={`${profile.name} portrait`} />
          </div>
          {chips.map((chip, i) => (
            <span key={chip.label} className={`float-chip chip-${i + 1}`}>
              {chip.emoji} {chip.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
