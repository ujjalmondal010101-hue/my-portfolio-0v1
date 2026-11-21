import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Work from './components/Work.jsx'
import Games from './components/Games.jsx'
import Journey from './components/Journey.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ChatBot from './components/ChatBot.jsx'
import GamesMenu from './pages/GamesMenu.jsx'
import GamePage from './pages/GamePage.jsx'
import { useReveal } from './hooks/useReveal.js'

function Home() {
  useReveal()
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Work />
      <Games />
      <Journey />
      <Contact />
    </main>
  )
}

function App() {
  return (
    <>
      <div className="bg-orbs" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<GamesMenu />} />
        <Route path="/games/:gameId" element={<GamePage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <ChatBot />
    </>
  )
}

export default App
