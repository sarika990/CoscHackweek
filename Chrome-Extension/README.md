# Cat-ify — Random Cat Image Replacer

> A Chrome extension (Manifest V3) that replaces **every image** on any webpage you visit with a fresh, random cat photo fetched live from public cat APIs.

![Cat-ify Icon](icons/icon128.png)

---

## What It Does

- 🐱 Replaces all `<img>` elements on a page with live cat images from [The Cat API](https://api.thecatapi.com) or [cataas.com](https://cataas.com).
- 👁️ Watches for dynamically loaded images using `MutationObserver` — no cat gets left behind.
- 🔄 Shows a loading placeholder while cat images are being fetched, preventing broken-image flashes.
- 🛡️ Falls back gracefully if an API is rate-limited or unavailable.
- 🎛️ Includes a polished popup UI to **toggle** replacement on/off per tab and **refresh** all cat images without reloading the page.

---

## File & Folder Structure

```
Chrome-Extension/
├── manifest.json          # MV3 extension config
├── content.js             # Content script: image replacement logic + MutationObserver
├── background.js          # Service worker: tab state management
├── popup/
│   ├── popup.html         # Popup UI markup
│   ├── popup.css          # Premium glassmorphism popup styles
│   └── popup.js           # Popup interactivity and messaging
├── icons/
│   ├── icon16.png         # Extension toolbar icon (16×16)
│   ├── icon48.png         # Extension management icon (48×48)
│   └── icon128.png        # Chrome Web Store icon (128×128)
├── README.md
├── LICENSE
└── .gitignore
```

---

## How to Load in Chrome (Developer Mode)

1. Open Chrome and navigate to **`chrome://extensions`**.
2. Enable **Developer Mode** using the toggle in the top-right corner.
3. Click **"Load unpacked"**.
4. Select the `Chrome-Extension` folder (the root folder containing `manifest.json`).
5. The **Cat-ify** extension will appear in your extensions list and toolbar.

---

## How to Test

1. After loading the extension, navigate to any image-heavy website (e.g., [Google Images](https://images.google.com), [Reddit](https://reddit.com), [BBC News](https://bbc.com)).
2. All images on the page should be replaced with random cat photos within a few seconds.
3. Click the **Cat-ify icon** in the Chrome toolbar to open the popup:
   - **Toggle switch** — disables/re-enables cat image replacement for the current tab.
   - **Refresh Cats** button — fetches new random cat images without reloading the page.
4. Navigate to a new page or tab — cat replacement starts automatically.

---

## APIs Used

| Source | URL | Notes |
|---|---|---|
| The Cat API | `https://api.thecatapi.com/v1/images/search` | Primary — returns batches of 25 images |
| cataas.com | `https://cataas.com/cat` | Secondary fallback |
| Unsplash (static) | `https://images.unsplash.com/...` | Emergency hardcoded fallback |

---

## Permissions Explained

| Permission | Why it's needed |
|---|---|
| `activeTab` | Access the current tab to inject messages |
| `scripting` | Run content scripts programmatically |
| `storage` | Store per-tab enabled/disabled state |

---

## Troubleshooting

- **Images not replaced on some sites** — some sites use CSS `background-image` instead of `<img>` tags (not currently replaced). The extension only targets HTML `<img>` elements.
- **Popup says "Content script not active"** — this happens on browser internal pages (`chrome://`, `chrome-extension://`) where extensions cannot run. Try a regular website.
- **Rate limited** — The extension automatically rotates through multiple API sources and falls back to static URLs, so this should be invisible to you.
