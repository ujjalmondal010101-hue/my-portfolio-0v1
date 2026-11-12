import Archery from './Archery.jsx'
import Penalty from './Penalty.jsx'
import LudoRace from './LudoRace.jsx'
import TicTacToe from './TicTacToe.jsx'
import Rps from './Rps.jsx'

// Single source of truth for the Games Arena.
// Add a new game here and it automatically appears
// on the games menu and the homepage.
export const GAMES = [
  {
    id: 'archery',
    emoji: '🏹',
    name: 'Archery',
    tagline: 'Time your shot — hit the golden bullseye for 10 points!',
    component: Archery,
  },
  {
    id: 'penalty',
    emoji: '⚽',
    name: 'Penalty Shootout',
    tagline: 'Five kicks, Ujjal in goal — can you beat the keeper?',
    component: Penalty,
  },
  {
    id: 'ludo',
    emoji: '🎲',
    name: 'Ludo Race',
    tagline: 'Roll, race and send Ujjal back to start!',
    component: LudoRace,
  },
  {
    id: 'tictactoe',
    emoji: '⭕',
    name: 'Tic-Tac-Toe',
    tagline: 'The classic — Ujjal plays smart, can you outsmart him?',
    component: TicTacToe,
  },
  {
    id: 'rps',
    emoji: '✊',
    name: 'Rock · Paper · Scissors',
    tagline: 'Quickfire rounds with a running score.',
    component: Rps,
  },
]
