# Digital Business Card Generator - vCardForge

A production-ready, professional web application built using React 19, Vite, and Tailwind CSS v4. Create, style, and share high-quality digital business cards with a real-time live preview, multiple premium templates, automatic vCard QR-code generation, and AI-suggested color palettes.

## 🚀 Key Features

* **Live Interactive Preview**: Instant card refresh as fields are modified, without any page reloads.
* **5 Professional Templates**:
  1. *Modern White*: Side-by-side spacing, elegant color borders, and neat alignment.
  2. *Dark Professional*: Premium charcoal background with glowing accents.
  3. *Ultra Minimal*: Lightweight typography and focus on whitespace.
  4. *Vibrant Gradient*: Smooth color gradients mapping to selected accent color.
  5. *Glassmorphism*: Translucent frosted glass effect using CSS backdrop filters.
* **AI-Based Color Suggestions**: Dynamically recommends accent color systems based on profession keywords in the Job Title.
* **Full Typography Control**: Select from Inter, Poppins, Roboto, and Montserrat.
* **Image Uploader**: Drag-and-drop or browse files with type (JPG/PNG/WEBP) and size (2MB) validation.
* **Local Storage Sync**: Automatically saves all inputs, themes, accents, and templates for instant reload.
* **Contact QR Code Generator**: Generates standard vCard (.vcf) format QR codes for contact importing directly into mobile address books.
* **Share API & Fallbacks**: Integrated Web Share API with instant base64 URL compression fallback.
* **High-Resolution Exports**: Custom PNG download (via `html-to-image`) and vector scaling PDF download (via `jsPDF` / `html2canvas`).

## 🛠️ Tech Stack & Libraries

* **Core**: React 19, Vite, JavaScript
* **Styling**: Tailwind CSS v4, Lucide React (via React Icons)
* **Animations**: Framer Motion
* **Utilities**:
  * `react-qr-code` for scanning.
  * `html-to-image` & `html2canvas` for page capturing.
  * `jspdf` for document printing.

---

## 💻 Installation & Running Locally

Ensure you have [Node.js](https://nodejs.org/) installed.

1. Clone or download the repository into a project directory.
2. Open terminal in the directory.
3. Install all dependencies:
   ```bash
   npm install
   ```
4. Start the Vite local development server:
   ```bash
   npm run dev
   ```
5. Build the production build:
   ```bash
   npm run build
   ```
