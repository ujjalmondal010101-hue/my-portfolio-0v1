import { skills } from '../data.js'

export default function Skills() {
  return (
    <section className="section section-tint" id="skills">
      <div className="container">
        <div className="section-head reveal">
          <span className="hand">what I bring to the table</span>
          <h2>
            My <span className="grad-text">Skills</span>
          </h2>
        </div>

        <div className="skills-grid">
          {skills.map((skill, i) => (
            <article
              key={skill.title}
              className={`skill-card reveal tone-${skill.tone}`}
              style={{ '--reveal-delay': `${i * 80}ms` }}
            >
              <span className="skill-emoji" aria-hidden="true">
                {skill.emoji}
              </span>
              <h3>{skill.title}</h3>
              <ul>
                {skill.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
