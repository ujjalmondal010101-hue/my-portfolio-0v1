import { useState } from 'react'
import { profile } from '../data.js'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#work', label: 'My Work' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <nav className="container nav-inner">
        <a href="#top" className="logo" onClick={() => setOpen(false)}>
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
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
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
