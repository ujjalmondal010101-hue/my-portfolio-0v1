import { profile } from '../data.js'

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {profile.name} · Made with 💜 in Kolkata
      </p>
    </footer>
  )
}
