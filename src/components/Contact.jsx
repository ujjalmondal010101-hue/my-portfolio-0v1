import { profile } from '../data.js'

export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head">
          <span className="hand">say hi, I don&apos;t bite</span>
          <h2>
            Get in <span className="grad-text">Touch</span>
          </h2>
        </div>

        <div className="contact-grid">
          <a className="contact-card" href={`mailto:${profile.email}`}>
            <span className="contact-emoji" aria-hidden="true">📧</span>
            <h3>Email</h3>
            <p>{profile.email}</p>
          </a>

          <a
            className="contact-card"
            href={profile.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact-emoji" aria-hidden="true">📱</span>
            <h3>Phone / WhatsApp</h3>
            <p>{profile.phone}</p>
          </a>

          <a
            className="contact-card"
            href={profile.youtube}
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact-emoji" aria-hidden="true">▶️</span>
            <h3>YouTube</h3>
            <p>{profile.youtubeHandle}</p>
          </a>
        </div>

        <div className="contact-cta">
          <a
            className="btn btn-primary"
            href={profile.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            💬 Chat on WhatsApp
          </a>
          <p className="contact-note">more socials (Instagram, Facebook) coming soon 🌱</p>
        </div>
      </div>
    </section>
  )
}
