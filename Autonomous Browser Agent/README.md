# BrowserPilot AI 🟢

> **An AI-powered browser automation platform** — describe a web task in plain English, and the agent executes it using Playwright + Gemini AI.

![BrowserPilot AI Dashboard](https://img.shields.io/badge/BrowserPilot_AI-v1.0.0-10B981?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4eiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=)

---

## 🌟 Features

- 🗣️ **Natural language task input** — no coding required
- 🎭 **Playwright automation** — real browser, real actions
- 📊 **Live dashboard** — real-time logs, progress, timeline
- 🖼️ **Screenshots** — captures evidence of every action
- 📋 **Structured results** — data extraction as JSON
- 📜 **Task history** — searchable past runs
- 🌙 **Dark/Light theme** — premium Emerald Liquid Glass UI

---

## 🗂️ Project Structure

```
Autonomous Browser Agent/
├── backend/
│   ├── .env                        # API keys (gitignored)
│   ├── .env.example                # Template for env setup
│   ├── requirements.txt            # Python dependencies
│   ├── run.py                      # Server startup script
│   └── app/
│       ├── main.py                 # FastAPI app
│       ├── config/
│       │   └── settings.py         # Config via pydantic-settings
│       ├── models/
│       │   └── schemas.py          # Pydantic schemas
│       ├── routes/
│       │   └── tasks.py            # API routes + WebSockets
│       └── services/
│           ├── task_manager.py     # Task state & execution engine
│           └── agents/
│               └── browser_agent.py # Playwright + Gemini agent
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx                # React entry point
│       ├── App.jsx                 # Routes + layout
│       ├── context/
│       │   └── ThemeContext.jsx    # Dark/Light mode
│       ├── services/
│       │   └── api.js              # Axios + WebSocket client
│       ├── styles/
│       │   └── index.css           # Global styles, glassmorphism
│       └── components/
│           ├── layouts/
│           │   ├── Navbar.jsx
│           │   ├── Sidebar.jsx
│           │   └── Breadcrumbs.jsx
│           └── pages/
│               ├── Home.jsx
│               ├── Features.jsx
│               ├── Dashboard.jsx
│               ├── TaskHistory.jsx
│               ├── Settings.jsx
│               ├── About.jsx
│               └── NotFound.jsx
│
├── run.bat                         # Windows one-click startup
└── README.md
```

---

## 🚀 Setup Guide

###