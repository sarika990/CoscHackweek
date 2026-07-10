# Pure CSS Stitch Artwork & Landing Page

A production-quality CSS Art Festival landing page featuring a detailed, responsive, and animated pure CSS illustration of **Stitch** (Disney's Experiment 626). 

This project is completely hand-coded using only semantic HTML5 and CSS3. It does not use any JavaScript, images, SVGs, canvas, or external image assets (not even background-image URLs). Everything you see is constructed using native HTML elements shaped, colored, and animated solely through CSS properties.

---

## 🎨 Project Overview

This project serves as a demonstration of modern frontend styling techniques. By leveraging advanced CSS positioning, `clip-path`, `box-shadow` layering, custom gradients, pseudo-elements, and keyframe animations, it creates a high-fidelity rendering of Stitch that is fully responsive and interactive.

### Features
- **Pure CSS Stitch**: A high-fidelity illustration containing detailed ears (with custom notches/inner cuts), expressive eyes (with blink animation), nose, open mouth (with teeth and tongue), body, belly, arms, and feet.
- **Micro-Animations**:
  - **Gentle Breathing**: Subtle scaling of the body and head.
  - **Blinking Eyes**: Regular natural blinking of the eyelids and reflections.
  - **Ear Wiggle**: Saccadic wiggling of the large ears.
  - **Interactive Hover Effects**: Dynamic card tilt styling, button shines, and smooth transition states.
- **Glassmorphic Landing Page**: Modern visual design including a Hero section, Feature Cards, About section, Showcase frame, and responsive Footer.
- **Responsive Layout**: Fluid scaling using relative units (`rem`, `vh`, `vw`, `%`) ensuring the artwork scales perfectly from wide desktop monitors to mobile phones without layout breakage or overflow.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic elements (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`) for structure, accessibility, and SEO.
- **CSS3**:
  - Custom Properties (CSS variables) for theme consistency.
  - Flexbox and CSS Grid for layouts.
  - Custom `clip-path` shapes.
  - Layered `box-shadow` for depth, highlights, and shadows.
  - 3D Transforms and Transitions for interactive micro-interactions.
  - `@keyframes` for smooth animations.

---

## 📂 Folder Structure

```text
css-art-festival/
│
├── index.html       # Semantic HTML5 document containing the landing page and artwork structure
├── style.css        # Modular, production-ready stylesheet (Variables, Reset, Layout, Art, Responsive)
├── LICENSE          # MIT License
└── README.md        # Documentation and Project Guide
```

---

## 🚀 How to Run

No installation, build process, or server configuration is required.
1. Download or clone this repository.
2. Open `index.html` directly in any modern web browser (Chrome, Firefox, Safari, Edge).

---

## 📐 CSS Techniques Used in Stitch Art

1. **Complex Border Radii**: Using 8-point values (`border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%`) to create organic head and ear curves.
2. **Layered Gradients & Inner Shadows**: Linear and radial gradients paired with inset box-shadows to simulate light sources, highlights, and 3D volume.
3. **Clip-Paths**: Used to clip the inner ears, eyes, and mouth shapes perfectly.
4. **Pseudo-Elements (`::before` & `::after`)**: Maximizing element utility by nesting highlights, claws, and tooth details without inflating the HTML DOM structure.

---

## 📝 Challenge Rules Followed

- [x] **No JavaScript**: 100% interactive using CSS hover, active, and animation states.
- [x] **No Images/SVGs/Canvas**: No `<img>` tags, SVG syntax, canvas context, or external background URLs.
- [x] **Semantic HTML**: Fully accessible markup utilizing ARIA roles and labels where appropriate.
- [x] **Responsive and Overflow-Free**: Zero horizontal scrollbars.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///d:/CSS%20Art%20Festival/LICENSE) file for details.
