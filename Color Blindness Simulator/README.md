# Color Vision Simulator

A premium, production-ready, client-side React web application designed to simulate various types of Color Vision Deficiency (CVD) - also known as color blindness - on user-uploaded images in real-time. Built using **React 18**, **Vite**, **Tailwind CSS**, and the **HTML5 Canvas API**.

---

## 🎨 Technology Stack

- **Frontend Core:** React 18, Vite (ES6+)
- **Styling:** Tailwind CSS with custom Glassmorphism designs (Green Liquid Glass theme)
- **State Management:** React Context API (SimulatorContext, ThemeContext)
- **Pixel-Level Processing:** HTML5 Canvas API
- **Animations:** Framer Motion (for smooth micro-interactions)
- **Icons:** Lucide React

---

## ✨ Features

- **Drag & Drop Upload:** Easy interface to upload PNG, JPG, JPEG, and WEBP files under 10MB.
- **Clipboard Integration:** Paste images directly from the clipboard (`Ctrl + V`) for rapid previews.
- **Precision Simulation:** True pixel-by-pixel processing using standard linear color transformation matrices.
- **Comparison Tooling:** 
  - **Side by Side:** Display the original and simulated outputs next to each other.
  - **Slider:** Drag an interactive before-and-after slider divider across the image.
  - **Single:** View the full simulated image.
- **Zoom & Pan controls:** Interactive pan coordinates and scale limits (50% to 400%).
- **Full Resolution Downloads:** Export processed images back to PNG or JPEG format preserving original sizes.
- **Theme Support:** Dark/Light mode selector, defaulting to the custom dark green liquid glass visual style.
- **100% Privacy:** Client-side execution with zero backend calls.

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── Compare/
│   │   ├── CompareSlider.jsx        # Draggable comparison slider
│   │   └── CompareSplit.jsx         # Side-by-side sync zoom/pan panels
│   ├── Controls/
│   │   ├── ModeCard.jsx             # Selector cards for each color deficiency
│   │   └── SimulationControls.jsx   # Grid coordinator for selectors
│   ├── Download/
│   │   └── DownloadButton.jsx       # Lossless/compact export trigger
│   ├── Footer/
│   │   └── Footer.jsx               # Copyright & local processing notice
│   ├── Navbar/
│   │   ├── AboutModal.jsx           # Educational explanation of color blindness
│   │   ├── Navbar.jsx               # Header layout
│   │   └── ThemeToggle.jsx          # Dark/Light selector trigger
│   ├── Preview/
│   │   ├── ImageInfo.jsx            # Metadata display card
│   │   ├── ImagePreview.jsx         # Panel orchestrating compare layouts
│   │   └── Toolbar.jsx              # Zoom, Fit, and reset triggers
│   └── common/
│       ├── EmptyState.jsx           # Startup splash page
│       ├── Loader.jsx               # Canvas loop processing indicator
│       └── Notification.jsx         # Floating toast alert banners
├── constants/
│   └── constants.js                 # Max file sizes, types, and mode definitions
├── context/
│   ├── SimulatorContext.jsx         # Global image & simulation state
│   └── ThemeContext.jsx             # Theme setting wrapper (localStorage sync)
├── filters/
│   ├── colorMatrices.js             # Standard conversion matrices
│   ├── simulateAchromatopsia.js
│   ├── simulateDeuteranopia.js
│   ├── simulateProtanopia.js
│   └── simulateTritanopia.js
├── hooks/
│   └── useTheme.js                  # Theme shorthand hook
├── utils/
│   ├── canvasUtils.js               # Canvas initialization and filter router
│   ├── downloadImage.js             # File trigger utility
│   └── imageLoader.js               # Image URL promise loader
├── App.jsx                          # Main wrapper
└── main.jsx                         # App entry
```

---

## 🧮 How Color Vision Simulation Works

The application modifies pixel colors by treating standard RGB vectors as linear matrices and multiplying them with conversion matrices derived from scientific color research (e.g. Viénot, Brettel and Mollon, 1999).

For each pixel:
$$\begin{bmatrix} R' \\ G' \\ B' \end{bmatrix} = \mathbf{M}_{CVD} \times \begin{bmatrix} R \\ G \\ B \end{bmatrix}$$

### Simulation Matrices ($\mathbf{M}_{CVD}$):

1. **Protanopia (Red Cone Deficiency):**
   $$\begin{bmatrix} 0.56667 & 0.43333 & 0.0 \\ 0.55833 & 0.44167 & 0.0 \\ 0.0 & 0.24167 & 0.75833 \end{bmatrix}$$

2. **Deuteranopia (Green Cone Deficiency):**
   $$\begin{bmatrix} 0.625 & 0.375 & 0.0 \\ 0.700 & 0.300 & 0.0 \\ 0.0 & 0.300 & 0.700 \end{bmatrix}$$

3. **Tritanopia (Blue Cone Deficiency):**
   $$\begin{bmatrix} 0.950 & 0.050 & 0.0 \\ 0.0 & 0.43333 & 0.56667 \\ 0.0 & 0.475 & 0.525 \end{bmatrix}$$

4. **Achromatopsia (Total Monochromacy):**
   $$\begin{bmatrix} 0.299 & 0.587 & 0.114 \\ 0.299 & 0.587 & 0.114 \\ 0.299 & 0.587 & 0.114 \end{bmatrix}$$

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (version 18+ recommended) installed.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build production bundle:
   ```bash
   npm run build
   ```

---

## 🔒 License

Distributed under the MIT License. See `LICENSE` for more information.
