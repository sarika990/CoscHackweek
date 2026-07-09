# Storage Explorer Pro

**Storage Explorer Pro** is a modern, lightweight, high-performance browser extension designed to inspect and manage client-side storage (`localStorage`, `sessionStorage`, and `Cookies`) of the currently active website. Built entirely using Vanilla HTML, CSS, and modern JavaScript modules, it requires no framework overhead and fits seamlessly into any Chrome or Edge developer's workflow.

---

## Features

1. **Client-side Storage Detection**:
   - **Local Storage**: Automatically inspects and lists all entries.
   - **Session Storage**: Automatically inspects and lists all entries.
   - **Cookies**: Reads and lists all cookies linked to the active webpage's URL.
2. **Detailed Item Metrics**: Displays the storage Key, Value, Type (with color-coded badges), and approximate byte size calculated on the fly.
3. **Real-time Search & Filtering**: Filters keys, values, and types instantly as you type.
4. **Data Actions**:
   - **Copy**: One-click copy options for both keys and values using the modern Clipboard API.
   - **Delete**: Individual item removal (with custom styled confirmation overlay).
   - **Clear**: Medium-specific clearing (Clear localStorage, sessionStorage, or cookies separately).
5. **Import & Export**:
   - Export full client-side storage states as a backup JSON file.
   - Import JSON backups to restore `localStorage` and `sessionStorage`. Displays warnings for browser-restricted cookie mutations.
6. **Statistics Dashboard**: Real-time counter of total items, counts per storage medium, total estimated footprint (Bytes, KB, MB), average size, and largest item tracking.
7. **Refined UX & Accessibility**:
   - Sticky table headers with an independent vertical scroll area.
   - Professional dark developer theme using variables, glassmorphism, and responsive styling.
   - Native-looking loading skeletons and toast notifications.
   - ARIA labels and keyboard navigation support.

---

## Folder Structure

```text
storage-explorer-pro/
├── manifest.json       # Extension Manifest V3 configuration
├── popup.html          # Main popup visual interface
├── popup.css           # Custom dark theme stylesheet
├── popup.js            # Coordinator script, entry point
├── background.js       # Background service worker script
├── content.js          # content.js injection reference
├── storage.js          # Storage operations layer (executes tab scripting / reads cookies)
├── search.js           # Search filter & sorting utility module
├── utils.js            # General utilities (sizes, clipboard, toasts, modals, downloads)
├── assets/
│   └── logo.svg        # SVG logo vector
└── icons/
    ├── icon16.png      # 16x16 PNG extension icon
    ├── icon32.png      # 32x32 PNG extension icon
    ├── icon48.png      # 48x48 PNG extension icon
    └── icon128.png     # 128x128 PNG extension icon
```

---

## Permissions Explanation

Storage Explorer Pro requests only the minimal permissions required to inspect client-side state:

- `activeTab`: Grants access to temporary script injection permissions into the active tab to inspect its storage contexts safely.
- `scripting`: Required to run functions on the active tab context to read/write `localStorage` and `sessionStorage`.
- `cookies`: Required to fetch and remove cookies for the active webpage's domain.
- `tabs`: Allows querying the active tab URL and state.
- `<all_urls>` (Host Permission): Required to allow cookie inspection and mutations on any site the user navigates to and opens the popup on.

---

## Installation & Setup

To load this extension in your browser, follow these simple steps:

### For Google Chrome:
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle switch in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the `storage-explorer-pro/` folder containing the code files.
5. The extension logo will appear in your extensions list. Pin it to your toolbar for easy access!

### For Microsoft Edge:
1. Open Microsoft Edge and navigate to `edge://extensions/`.
2. Enable **Developer mode** using the toggle in the lower-left corner of the side menu.
3. Click **Load unpacked** at the top of the extensions list.
4. Select the `storage-explorer-pro/` directory.

---

## Browser Compatibility

Fully compatible with any modern Chromium-based browser:
- Google Chrome (Version 88+)
- Microsoft Edge (Version 88+)
- Brave Browser
- Opera

---

## Usage Guide

1. Navigate to any website you want to inspect (e.g. `https://example.com`).
2. Click the **Storage Explorer Pro** icon in your browser toolbar.
3. The popup automatically fetches and presents all client-side storage components, updating the statistics immediately.
4. Use the **Search bar** to locate keys or values dynamically.
5. Click the copy icon to copy a key or value, or click on a value cell to copy it quickly.
6. Click the trash bin to delete specific keys, or use the clear button row to clear entire storage media.
7. Click **Export JSON** to save a snapshot, and use **Import JSON** to load a backup on the page.

---

## License

This project is licensed under the MIT License.
