# MetaInspect — File Metadata Inspector

MetaInspect is a premium, client-side File Metadata Inspector built using React, TypeScript, Vite, and Tailwind CSS. It allows users to upload files (such as PDF documents and images), securely extract their metadata (like EXIF data and document properties), preview them, and export the structured metadata.

Since all extraction and processing occur locally in the user's browser, no files are uploaded to any server, ensuring complete privacy.

---

## Features

- 📂 **Multi-format Support**: Inspect PDF documents and common image formats (JPEG, PNG, TIFF, etc.).
- 🛡️ **EXIF Data Extraction**: View detailed camera settings, GPS location data, lens profile, capture dates, and image specs using `exifr`.
- 📄 **PDF Details**: Extract PDF metadata (title, author, creation date, modifications, page count, and creator details) using `pdfjs-dist`.
- 👁️ **Interactive Previews**: Dynamic live visual preview of images and the first page of PDF files.
- 💾 **Data Export**: Export extracted metadata in **JSON** or **CSV** format, or copy to clipboard with a single click.
- ⚡ **Performance & Design**: Extremely responsive premium UI with dark mode synchronization, keyboard shortcuts, and smooth animations powered by `framer-motion`.

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18.x or later) and `npm` installed.

### Installing Dependencies

Install the project dependencies using `npm`:

```bash
npm install
```

### Environment Variables

MetaInspect processes everything in-browser and doesn't require backend integrations or API keys. However, you can configure local environment variables if desired.

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. The default variables are:
   - `PORT`: Dev server port (default: `5173`)
   - `VITE_APP_TITLE`: Custom application browser title

### Running the Project Locally

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port specified in your shell output).

### Building the Project

Build the application for production deployment:

```bash
npm run build
```

This compiles TypeScript using `tsc` and bundles assets with Vite. The output assets will be generated inside the `dist/` directory.

### Code Quality (Linting)

To check for syntax, quality, or formatting warnings:

```bash
npm run lint
```

---

## Troubleshooting Common Issues

### 1. `pdfjs-dist` Render or Worker Thread Errors
- **Issue**: PDF rendering or worker scripts fail to load in the browser.
- **Solution**: Ensure your browser supports Web Workers and ES modules. MetaInspect dynamically imports and maps the worker script from `pdfjs-dist` relative to `import.meta.url`. Clear browser cache or run a fresh build if resources fail to resolve.

### 2. Dependency Resolution Conflicts
- **Issue**: Standard installation errors due to version conflicts (e.g. React 19 compatibility).
- **Solution**: Run `npm install --legacy-peer-deps` to force installation of peer dependencies if necessary.

### 3. Missing EXIF Data
- **Issue**: Uploaded image shows "No EXIF metadata found."
- **Solution**: Not all images contain EXIF data. Images downloaded from chat apps, social media, or screenshotted files usually have metadata stripped for privacy. Try uploading an original photograph captured on a smartphone or camera.
