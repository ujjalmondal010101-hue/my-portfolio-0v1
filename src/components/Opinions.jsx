import { Link } from 'react-router-dom'

function askAssistant() {
  window.dispatchEvent(new CustomEvent('um-open-chat'))
}

export default function Opinions() {
  return (
    <section className="section opinions-section" id="opinions">
      <div className="container">
        <div className="section-head reveal">
          <span className="hand">i&apos;d love to hear from you 💬</span>
          <h2>
            Visitors&apos; <span className="grad-text">Opinions</span>
          </h2>
          <p className="section-sub">
            Watched a video? Read a poem? Tell me what you think — you can even
            attach a file. <strong>Nothing you send is shown publicly.</strong>
          </p>
        </div>

        <div className="opinion-hero reveal">
          <div className="opinion-hero-text">
            <span className="opinion-mark" aria-hidden="true">
              “
            </span>
            <h3>Your words make my day ✨</h3>
            <p>
              Write a note, give a star rating and — if you like — upload a
              photo, drawing or document. It takes 30 seconds, and I read every
              single one.
            </p>

            <div className="opinion-actions">
              <Link to="/opinions" className="btn btn-primary">
                ✍️ Write your opinion
              </Link>
              <button type="button" className="btn btn-ghost" onClick={askAssistant}>
                🤖 Ask the assistant
              </button>
            </div>

            <p className="opinion-count">🔒 Private · no sign-up needed</p>
          </div>

          <ul className="opinion-points">
            <li>
              <span aria-hidden="true">⭐</span>
              <div>
                <b>Rate my work</b>
                <p>1 to 5 stars — honest feedback is welcome!</p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">📎</span>
              <div>
                <b>Attach any file</b>
                <p>Photo, drawing, PDF or document — up to 8 MB.</p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">🔒</span>
              <div>
                <b>Private by default</b>
                <p>Your note and upload never appear on the website.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
