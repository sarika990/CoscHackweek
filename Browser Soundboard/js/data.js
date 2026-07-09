const SOUNDS_DATA = [
  {
    id: 'piano',
    name: 'Piano',
    category: 'Music',
    src: 'assets/sounds/piano.mp3',
    shortcut: '1',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
      <line x1="6" y1="3" x2="6" y2="21"/>
      <line x1="10" y1="3" x2="10" y2="21"/>
      <line x1="14" y1="3" x2="14" y2="21"/>
      <line x1="18" y1="3" x2="18" y2="21"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
    </svg>`
  },
  {
    id: 'drum',
    name: 'Drum',
    category: 'Music',
    src: 'assets/sounds/drum.mp3',
    shortcut: '2',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="12" cy="7" rx="9" ry="3"/>
      <path d="M3 7v10c0 1.66 4 3 9 3s9-1.34 9-3V7"/>
      <line x1="12" y1="7" x2="12" y2="20"/>
      <path d="m5 4 4.5 2"/>
      <path d="m19 4-4.5 2"/>
      <circle cx="5" cy="4" r="1"/>
      <circle cx="19" cy="4" r="1"/>
    </svg>`
  },
  {
    id: 'clap',
    name: 'Clap',
    category: 'Effects',
    src: 'assets/sounds/clap.mp3',
    shortcut: '3',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>`
  },
  {
    id: 'bell',
    name: 'Bell',
    category: 'Music',
    src: 'assets/sounds/bell.mp3',
    shortcut: '4',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>`
  },
  {
    id: 'guitar',
    name: 'Guitar',
    category: 'Music',
    src: 'assets/sounds/guitar.mp3',
    shortcut: '5',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18H8a6 6 0 1 1 0-12h1a6 6 0 1 1 0 12z"/>
      <path d="M12 2v6"/>
      <path d="m19 13.5-3.5-3.5"/>
      <path d="m15.5 17-3.5-3.5"/>
      <circle cx="8" cy="12" r="1"/>
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
    </svg>`
  },
  {
    id: 'rain',
    name: 'Rain',
    category: 'Nature',
    src: 'assets/sounds/rain.mp3',
    shortcut: 'A',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
      <line x1="8" y1="20" x2="6" y2="22"/>
      <line x1="12" y1="20" x2="10" y2="22"/>
      <line x1="16" y1="20" x2="14" y2="22"/>
    </svg>`
  },
  {
    id: 'thunder',
    name: 'Thunder',
    category: 'Nature',
    src: 'assets/sounds/thunder.mp3',
    shortcut: 'S',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 8.58"/>
      <polyline points="13 11 9 17 12 17 11 23 15 17 12 17 13 11"/>
    </svg>`
  },
  {
    id: 'bird',
    name: 'Bird',
    category: 'Animals',
    src: 'assets/sounds/bird.mp3',
    shortcut: 'D',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 3c-3.47 0-6.44 2.24-7.53 5.34L4.85 7.08a1 1 0 0 0-1.39.28 1 1 0 0 0 .28 1.39l2.84 1.83C6.21 11.23 6 11.96 6 12.72v1.56a6.002 6.002 0 0 0 5 5.92V22a1 1 0 0 0 2 0v-1.8a6 6 0 0 0 5-5.92v-1.56c0-.76-.21-1.49-.58-2.14l2.84-1.83a1 1 0 0 0 .28-1.39 1 1 0 0 0-1.39-.28l-3.62 2.26C14.44 5.24 11.47 3 8 3z"/>
      <path d="M10 9a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/>
    </svg>`
  },
  {
    id: 'cat',
    name: 'Cat',
    category: 'Animals',
    src: 'assets/sounds/cat.mp3',
    shortcut: 'F',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 5c.67 0 1.35.09 2 .26L18.5 2 17.1 6.8c1.8 1.25 2.9 3.25 2.9 5.2 0 3.86-3.58 7-8 7s-8-3.14-8-7c0-1.95 1.1-3.95 2.9-5.2L5.5 2 10 5.26c.65-.17 1.33-.26 2-.26z"/>
      <circle cx="9" cy="11" r="1" fill="currentColor"/>
      <circle cx="15" cy="11" r="1" fill="currentColor"/>
      <path d="M12 14c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
      <path d="M9.5 15.5c1.5.8 3.5.8 5 0"/>
    </svg>`
  },
  {
    id: 'applause',
    name: 'Applause',
    category: 'Effects',
    src: 'assets/sounds/applause.mp3',
    shortcut: 'Z',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 20V10M14 20V4M10 20v-6M6 20v-4M2 20v-8M22 20v-12"/>
    </svg>`
  },
  {
    id: 'laugh',
    name: 'Laugh',
    category: 'Fun',
    src: 'assets/sounds/laugh.mp3',
    shortcut: 'X',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
      <path d="M8 9h2M14 9h2"/>
    </svg>`
  },
  {
    id: 'horn',
    name: 'Horn',
    category: 'Fun',
    src: 'assets/sounds/horn.mp3',
    shortcut: 'C',
    icon: `<svg viewBox="0 0 24 24" class="card-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8h-1a4 4 0 0 0-4-4H5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h8a4 4 0 0 0 4-4h1v1a3 3 0 0 0 6 0V9a3 3 0 0 0-6-1z"/>
      <path d="M10 8v8"/>
    </svg>`
  }
];

const CATEGORIES = ['All', 'Music', 'Nature', 'Animals', 'Effects', 'Fun'];
