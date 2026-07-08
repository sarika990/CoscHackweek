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

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/)

---

### Step 1 — Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Configure environment
copy .env.example .env
# Open .env and set your GEMINI_API_KEY
```

**Edit `backend/.env`:**
```env
HOST=0.0.0.0
PORT=8000
GEMINI_API_KEY=your_gemini_api_key_here
PLAYWRIGHT_HEADLESS=True
DATA_DIR=./data
```

### Step 2 — Frontend Setup

```bash
cd ../frontend

# Install npm dependencies
npm install
```

---

## ▶️ Running the Application

### Option A: One-Click (Windows)

Double-click **`run.bat`** in the root folder. It starts both servers in separate windows.

### Option B: Manual

**Terminal 1 — Start Backend:**
```bash
cd backend
venv\Scripts\activate
python run.py
```

**Terminal 2 — Start Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🌐 Access the App

| Service    | URL                           |
|------------|-------------------------------|
| Frontend   | http://localhost:3000          |
| Backend API| http://localhost:8000          |
| API Docs   | http://localhost:8000/docs     |

---

## 🔑 Environment Variables

| Variable              | Description                        | Default       |
|-----------------------|------------------------------------|---------------|
| `GEMINI_API_KEY`      | Your Google Gemini API key         | *(required)*  |
| `HOST`                | Backend server host                | `0.0.0.0`     |
| `PORT`                | Backend server port                | `8000`        |
| `PLAYWRIGHT_HEADLESS` | Run browser headlessly             | `True`        |
| `DATA_DIR`            | Folder for screenshots/downloads   | `./data`      |

---

## 🧪 Supported Task Examples

Paste these directly into the Dashboard:

```
Search Python internships in Lucknow
Search YouTube tutorials for machine learning
Compare prices of wireless headphones
Find scholarships for B.Tech students in India
Search GitHub repositories for React dashboard templates
Summarize the python.org website
Search Google News for AI technology developments
Search Google for top 5 open source LLMs and summarize results
Fill a demo registration form
```

---

## 🛠️ Technology Stack

| Layer        | Technologies                          |
|--------------|---------------------------------------|
| Frontend     | React 18, Vite, Tailwind CSS, Lucide  |
| State        | React Context API                     |
| Routing      | React Router v6                       |
| HTTP Client  | Axios                                 |
| Backend      | Python, FastAPI, Uvicorn              |
| AI Engine    | Gemini 1.5 Flash (Google AI)          |
| Automation   | Playwright (Chromium)                 |
| Data Schema  | Pydantic v2                           |
| Config       | pydantic-settings + python-dotenv     |
| Realtime     | WebSockets                            |

---

## 📦 Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

**Backend:**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

---

## 🔮 Future Improvements

- [ ] Export results to PDF / CSV
- [ ] Task scheduling (run task every N minutes)
- [ ] Multi-agent parallel execution
- [ ] Browser session recording (video)
- [ ] OpenAI GPT-4o as alternative AI engine
- [ ] User authentication and multi-user support
- [ ] Docker + docker-compose deployment
- [ ] Kubernetes scaling configuration

---

## 📄 License

MIT License — free for personal and commercial use.

