import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Work from './components/Work.jsx'
import Games from './components/Games.jsx'
import Journey from './components/Journey.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import GamesMenu from './pages/GamesMenu.jsx'
import GamePage from './pages/GamePage.jsx'

function Home() {
  return (
    <main>
      <Hero />
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
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<GamesMenu />} />
        <Route path="/games/:gameId" element={<GamePage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
