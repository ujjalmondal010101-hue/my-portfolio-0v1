import { works } from '../data.js'

export default function Work() {
  return (
    <section className="section" id="work">
      <div className="container">
        <div className="section-head reveal">
          <span className="hand">things I&apos;ve made &amp; love doing</span>
          <h2>
            My <span className="grad-text">Work</span>
          </h2>
        </div>

        <div className="work-grid">
          {works.map((work, i) => (
            <article
              key={work.title}
              className={`work-card reveal ${work.featured ? 'featured' : ''}`}
              style={{ '--reveal-delay': `${i * 80}ms` }}
            >
              <span className="work-tag">{work.tag}</span>
              <span className="work-emoji" aria-hidden="true">
                {work.emoji}
              </span>
              <h3>{work.title}</h3>
              <p>{work.description}</p>
              {work.link && (
                <a
                  className="work-link"
                  href={work.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {work.linkLabel} <span className="arrow">→</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
