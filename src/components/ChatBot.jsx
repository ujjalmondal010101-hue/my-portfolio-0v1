import { useEffect, useRef, useState } from 'react'
import { getAnswer, QUICK_QUESTIONS } from '../assistant/knowledge.js'

const WELCOME =
  "Hi there! 👋 I'm UM Assistant — I know everything about Ujjal. Ask me about his YouTube channel, writing, football, education, or how to reach him!"

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: WELCOME }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef(null)
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [messages, typing, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function send(text) {
    const clean = text.trim()
    if (!clean || typing) return
    setMessages((m) => [...m, { from: 'user', text: clean }])
    setInput('')
    setTyping(true)
    timerRef.current = setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: getAnswer(clean) }])
      setTyping(false)
    }, 700 + Math.random() * 500)
  }

  return (
    <>
      <button
        type="button"
        className={`chat-fab ${open ? 'open' : ''}`}
        aria-label={open ? 'Close chat assistant' : 'Chat with UM Assistant'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label="UM Assistant chat">
          <div className="chat-head">
            <span className="chat-bot" aria-hidden="true">
              🤖
            </span>
            <div className="chat-title">
              <h3>UM Assistant</h3>
              <p>online · answers about Ujjal</p>
            </div>
            <button
              type="button"
              className="chat-close"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chat-body" ref={bodyRef} aria-live="polite">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="msg bot typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <div className="chat-chips">
            {QUICK_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                className="chip-btn"
                onClick={() => send(question)}
              >
                {question}
              </button>
            ))}
          </div>

          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about Ujjal…"
              aria-label="Your message"
            />
            <button type="submit" className="chat-send" aria-label="Send message">
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  )
}
