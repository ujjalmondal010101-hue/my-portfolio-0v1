import { journey } from '../data.js'

export default function Journey() {
  return (
    <section className="section section-tint" id="journey">
      <div className="container">
        <div className="section-head">
          <span className="hand">my story so far</span>
          <h2>
            Education &amp; <span className="grad-text">Journey</span>
          </h2>
        </div>

        <div className="timeline">
          {journey.map((item) => (
            <article key={item.title} className="tl-item">
              <span className="tl-time">{item.time}</span>
              <h3>
                <span aria-hidden="true">{item.emoji}</span> {item.title}
              </h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
