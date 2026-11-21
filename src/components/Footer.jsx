import { Link } from 'react-router-dom'
import { profile } from '../data.js'

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {profile.name} · Made with 💜 in Kolkata
      </p>
      <p className="footer-links">
        <Link to="/opinions">✍️ Leave an opinion</Link>
        <span aria-hidden="true">·</span>
        <Link to="/inbox">🔒 Owner inbox</Link>
      </p>
    </footer>
  )
}
