# Premium Rock Paper Scissors - Battle Arena

A premium-quality, responsive, and highly interactive Player vs Computer Rock Paper Scissors Game built entirely with modern HTML5, CSS3, and Vanilla JavaScript. Features dark/light themes, Best of 5 match play, Web Audio synthesized sounds, high-fidelity custom confetti, dynamic stats tracking, and keyboard accessibility.

## 🚀 Live Demo & Screenshots

![Main Board Screenshot](screenshots/main_board.png)

## ✨ Features

- **Double-Layered Dynamic Atmosphere**:
  - CSS-animated gradient background.
  - Floating blurred background particles.
- **Synth Audio System**: Real-time synthesized retro-modern audio effects utilizing the browser's native **Web Audio API** (Zero external audio asset requests).
- **Custom Confetti System**: High-fidelity confetti particles rendered on a dedicated 2D canvas overlay using custom physics upon a winning round.
- **Extended Statistics & Leaderboards**:
  - Live Win Rate percentage.
  - Current streak and longest win streak tracking.
  - Overall game ratio (Wins/Losses/Draws).
- **Match Modes**:
  - **Normal Mode**: Play at your own pace with persistent scores.
  - **Best of 5 Match Mode**: Toggle match play; first opponent to secure 3 wins claims victory.
- **Polished Visual Polish**:
  - Interactive glassmorphic panels.
  - Highlighted winner pulse animation.
  - Choice selector hover/click glow effect.
- **Accessibility & Shortcuts**:
  - Screen reader-ready markup with ARIA roles and labels.
  - Responsive keyboard shortcuts hint integration.

---

## 🎮 Keyboard Controls

| Key | Action |
| --- | --- |
| **`R`** | Select **Rock** |
| **`P`** | Select **Paper** |
| **`S`** | Select **Scissors** |
| **`Enter`** | **Play Again** (Active after a Best of 5 round concludes) |
| **`Esc`** | **Reset All Progress** (Launches confirmation dialog) |

---

## 📂 Folder Structure

```text
rock-paper-scissors/
│── index.html          # Accessible DOM & Inline SVGs
│── style.css           # Theme styles & Responsive designs
│── script.js           # Synth sound engine, state & game loops
│── README.md           # Documentation
│
├── assets/
│   ├── images/         # Static visual resources
│   ├── icons/          # SVGs & Vector icons
│   └── sounds/         # Legacy audio resources (optional)
│
└── screenshots/        # Application showcase images
```

---

## 🛠️ Technologies Used

- **Markup**: Semantic HTML5, ARIA specifications
- **Styles**: Vanilla CSS3 (Custom Variables, Flexbox, Grid Layouts, Keyframes)
- **Engine**: Modern ES6+ JavaScript, Web Audio API, Canvas 2D API
- **Persistence**: Web Storage API (LocalStorage)

---

## ⚙️ How to Run

1. Clone or download this project directory.
2. Open `index.html` directly in any modern web browser:
   - Google Chrome
   - Firefox
   - Microsoft Edge
   - Safari
3. **No server, compilation, or installation step is required!**

---

## 📝 Game Rules

- **Rock** beats **Scissors**
- **Scissors** beats **Paper**
- **Paper** beats **Rock**
- Matches with the same choice result in a **Draw**.

---

## 🔮 Future Improvements

- [ ] Online Multiplayer lobby support via WebSockets.
- [ ] Sound synthesizer customization panel (frequency adjustments).
- [ ] Visual asset themes (Cyberpunk, Retro Pixel, Minimalist).

## 📄 License

This project is licensed under the MIT License.

## ✍️ Author

Created by a premium Frontend Engineer.
