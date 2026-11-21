// UM Assistant — a friendly, offline "AI" that answers visitor
// questions about Ujjal using a keyword-matching knowledge base.

import { profile } from '../data.js'

export const QUICK_QUESTIONS = [
  'Who is Ujjal?',
  'YouTube channel?',
  'What does he write?',
  'Can I hire him?',
  'What games can I play?',
]

const ANSWERS = {
  greeting:
    "Hey there! 👋 I'm UM Assistant — Ujjal's little helper. Ask me about his YouTube channel, writing, football, education or how to contact him!",
  who:
    'Ujjal Mondal is a content creator, writer, actor and footballer from Kolkata, India 🇮🇳. He runs the YouTube channel “Oishik & Friends Connection”, writes most of his video scripts himself, and plays midfield/defence on the football field. Fun fact: the 🤖 computer player in the games is named after him!',
  youtube:
    'Ujjal\'s YouTube channel is “Oishik & Friends Connection” — he creates videos and writes most of them himself! Watch here: youtube.com/@OishikAndFriendsConnection 🎬',
  writing:
    'Words are his playground ✍️ — Ujjal writes poems, short stories and the scripts for his YouTube videos. Check the “Poems & Short Stories” card in the My Work section!',
  football:
    '⚽ Ujjal plays football as a midfielder and defender — reading the game, breaking attacks and building plays. He says he reads a match the same way he reads a story: looking for the perfect moment.',
  acting:
    '🎭 Ujjal acts in his own scripts — characters, comedy and drama. It\'s all home-grown content for his YouTube channel “Oishik & Friends Connection”.',
  education:
    '🎓 Ujjal graduated in 2020 with a B.Sc. in Computer Science from Panihati Mahavidyalaya — 75.35%. So yes, there\'s a tech brain behind all the creativity!',
  skills:
    'His superpowers: 🎬 content creation & scripting, ✍️ creative writing (poems, stories, scripts), 🎭 acting, ⚽ football (midfield/defence) and 🧠 computer science fundamentals.',
  contact: `You can reach Ujjal at ${profile.email} 📧 or on WhatsApp/phone at ${profile.phone} 📱. There's also a “Chat on WhatsApp” button in the Contact section — he replies fast!`,
  hire: `Want to collaborate with Ujjal? 🤝 He's open to video collaborations, creative projects, acting/writing work and sponsorships. Best way: WhatsApp ${profile.phone} or email ${profile.email}.`,
  location: 'Ujjal is from Kolkata, West Bengal, India 🇮🇳 — the City of Joy!',
  games:
    '🎮 There are 5 games in the arena — all against a computer player called Ujjal! 🏹 Archery, ⚽ Penalty Shootout, 🎲 Ludo Race, ⭕ Tic-Tac-Toe and ✊ Rock·Paper·Scissors. Head to the Games section to play!',
  resume:
    '📄 Ujjal is preparing his CV — it will be downloadable here soon! Meanwhile, his full story is on this site, and you can message him on WhatsApp for details: +91 62904 19705.',
  socials:
    'Right now YouTube is live: youtube.com/@OishikAndFriendsConnection 🎬. Instagram and Facebook are coming soon — check back later!',
  website:
    'This portfolio shows Ujjal\'s world — videos, writing, football and games 🎮. It\'s built with React + Vite, and even the games are hand-coded. Fancy, right? 😄',
  thanks:
    'Anytime! 😄 If you want to say hi to the real Ujjal, WhatsApp him at +91 62904 19705.',
  bye:
    'Goodbye! 👋 Come back anytime — and don\'t forget to challenge Ujjal in the games! 🎮',
}

const INTENTS = [
  { id: 'greeting', keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening', 'yo', 'hola'] },
  { id: 'who', keywords: ['who is', 'who', 'about him', 'about ujjal', 'about', 'introduce', 'introduction', 'profile', 'bio', 'biography', 'ujjal mondal', 'ujjal'] },
  { id: 'youtube', keywords: ['youtube', 'channel', 'oishik', 'video', 'videos', 'subscribe', 'content creator', 'content', 'watch'] },
  { id: 'writing', keywords: ['write', 'writes', 'writer', 'writing', 'poem', 'poems', 'poetry', 'story', 'stories', 'script', 'scripts'] },
  { id: 'football', keywords: ['football', 'soccer', 'sport', 'sports', 'midfield', 'defender', 'defence', 'midfielder', 'tournament', 'match'] },
  { id: 'acting', keywords: ['act', 'acts', 'acting', 'actor', 'drama', 'perform', 'performance', 'stage', 'theatre'] },
  { id: 'education', keywords: ['education', 'study', 'studies', 'studied', 'college', 'university', 'bsc', 'computer science', 'graduated', 'graduate', 'graduation', 'panihati', 'degree', 'marks', 'percentage'] },
  { id: 'skills', keywords: ['skills', 'skill', 'talent', 'talents', 'good at', 'strengths', 'speciality', 'specialty'] },
  { id: 'contact', keywords: ['contact', 'email', 'mail', 'phone', 'call', 'whatsapp', 'number', 'reach', 'message', 'dm'] },
  { id: 'hire', keywords: ['hire', 'collab', 'collaboration', 'collaborate', 'business', 'sponsor', 'sponsorship', 'work with', 'booking', 'book', 'project'] },
  { id: 'location', keywords: ['where', 'live', 'lives', 'location', 'city', 'kolkata', 'based'] },
  { id: 'games', keywords: ['game', 'games', 'gaming', 'archery', 'penalty', 'ludo', 'tic tac toe', 'rock paper scissors', 'mini game', 'play'] },
  { id: 'resume', keywords: ['resume', 'cv', 'curriculum', 'download'] },
  { id: 'socials', keywords: ['instagram', 'insta', 'facebook', 'social', 'socials', 'twitter'] },
  { id: 'website', keywords: ['website', 'site', 'portfolio', 'made this', 'design'] },
  { id: 'thanks', keywords: ['thanks', 'thank', 'thank you', 'awesome', 'great', 'nice', 'love it', 'cool'] },
  { id: 'bye', keywords: ['bye', 'goodbye', 'see you', 'good night', 'later'] },
]

const FALLBACK =
  'Hmm, that\'s beyond my tiny robot brain 🤖😅. I mostly know Ujjal facts! Try: “Who is Ujjal?”, “Tell me about his YouTube”, “How do I contact him?” — or tap a suggestion below. For anything else, WhatsApp Ujjal: +91 62904 19705.'

export function getAnswer(raw) {
  const q = ` ${raw.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()} `
  if (!q.trim()) return FALLBACK

  let bestId = null
  let bestScore = 0

  for (const intent of INTENTS) {
    let score = 0
    for (const keyword of intent.keywords) {
      if (q.includes(` ${keyword} `)) score += keyword.length
    }
    if (score > bestScore) {
      bestScore = score
      bestId = intent.id
    }
  }

  return bestId ? ANSWERS[bestId] : FALLBACK
}
