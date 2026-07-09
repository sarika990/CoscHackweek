# Browser Soundboard

A premium-quality, production-ready **Browser Soundboard** web application featuring a modern, dark glassmorphic design, custom-synthesized local audio files, advanced Web Audio API fallback synthesis, and robust keyboard shortcuts. Built purely with semantic HTML5, Vanilla CSS3, and modern ES6 JavaScript.

## 🚀 Features

- **Dark Glassmorphism Interface**: Sleek premium dark theme with interactive glows, glass panels, customized typography, and micro-interactions.
- **12 High-Quality Sounds**: Sound effects spanning categories like Music, Nature, Animals, Effects, and Fun.
- **Advanced Audio Engine**:
  - Full volume scale support (Master slider + sound-specific controls).
  - Stop All, Mute All, Shuffle, Reset, and Loop toggle functionality.
  - Seekable audio progress bars with current and duration trackers.
  - **Auto-Synthesis Fallback**: Utilizes the Web Audio API to dynamically generate synthesize tones if assets fail to load or are missing, ensuring the app never crashes.
- **Live Search & Category Filtering**: Instantly filters sound cards as you type or click categories without any page refreshes.
- **Keyboard Shortcuts**: Key bindings (`1-9`, `A`, `S`, `D`, `F`, `Z`, `X`, `C`) to trigger individual sounds with visual keypad press feedback.
- **Sticky Now Playing Panel**: A floating glass deck tracking active track status, seekable progress, loop toggling, volume scales, and media controls.
- **LocalStorage State Persistence**: Remembers your favorite sounds, master volume settings, theme (dark/light), and last selected category tab across page reloads.
- **Aesthetic Micro-Animations**: Smooth ripple effects, card lifts, active equalizers, glowing borders, and toast alerts.

---

## 📂 Project Structure

```
soundboard/
│
├── index.html
├── README.md
├── generate_sounds.py
│
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
│
├── js/
│   ├── data.js
│   ├── audio.js
│   ├── ui.js
│   └── app.js
│
└── assets/
    └── sounds/
        ├── piano.mp3
        ├── drum.mp3
        ├── clap.mp3
        ├── bell.mp3
        ├── guitar.mp3
        ├── rain.mp3
        ├── thunder.mp3
        ├── bird.mp3
        ├── applause.mp3
        ├── laugh.mp3
        ├── horn.mp3
        └── cat.mp3
```

---

## 🛠️ Installation & Setup

1. **Clone/Download the repository** to your local machine:
   ```bash
   git clone https://github.com/yourportfolio/soundboard.git
   cd soundboard
   ```

2. **Generate sounds (Optional)**:
   The repository already includes pre-generated standard synthesizer sound files under `assets/sounds/`. To regenerate them, run:
   ```bash
   python generate_sounds.py
   ```

3. **Run the application**:
   Open `index.html` directly in any web browser, or serve it using a lightweight local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (Live Server)
   npx live-server
   ```
   Access the soundboard at `http://localhost:8000`.

---

## 🎹 Keyboard Shortcuts

- `1`: Piano
- `2`: Drum
- `3`: Clap
- `4`: Bell
- `5`: Guitar
- `A`: Rain
- `S`: Thunder
- `D`: Bird
- `F`: Cat
- `Z`: Applause
- `X`: Laugh
- `C`: Horn

---

## 💻 Technologies Used

- **HTML5**: Semantic tags, audio interfaces, responsive viewports, SVG icons.
- **CSS3**: Custom variables, Glassmorphism design system, flexbox, CSS grid, keyframe micro-animations, media queries.
- **Vanilla JavaScript**: ES6 modules/classes, DOM manipulation, LocalStorage APIs, event listeners, Web Audio API (real-time wave synthesis fallback).
- **Python**: Synthesis wave writer for creating local assets.
