import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import { profile } from '../data.js'
import { goToSection } from '../utils/scroll.js'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#work', label: 'My Work' },
  { href: '#games', label: 'Games' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function go(href) {
    setOpen(false)
    goToSection(navigate, href)
  }

  function goHome() {
    setOpen(false)
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="navbar">
      <nav className="container nav-inner">
        <a
          href="#/"
          className="logo"
          onClick={(e) => {
            e.preventDefault()
            goHome()
          }}
        >
          {profile.initials}<span>.</span>
        </a>

        <button
          type="button"
          className="menu-btn"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </button>

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  go(link.href)
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <a
              className="nav-cta"
              href={profile.youtube}
              target="_blank"
              rel="noreferrer"
            >
              🎬 YouTube
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
