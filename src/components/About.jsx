import { profile, about } from '../data.js'

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-head reveal">
          <span className="hand">a little about me</span>
          <h2>
            About <span className="grad-text">Me</span>
          </h2>
        </div>

        <div className="about-grid">
          <div className="about-text reveal">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <ul className="fact-list reveal" style={{ '--reveal-delay': '120ms' }}>
            {profile.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
