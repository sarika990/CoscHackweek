# ImagoCompare - Duplicate & Visually Similar Image Detection Tool

ImagoCompare is a production-quality, advanced-level duplicate and visually similar image detection application. Using multiple perceptual and mathematical image hashing techniques, it detects identical and manipulated images (resized, compressed, rotated, contrast/brightness-altered) with real-time similarity calculations and interactive analytics.

## Technologies Used

### Frontend
- **React (Vite)**: Clean single-page architecture
- **Tailwind CSS**: Modern glassmorphic theme styling
- **Framer Motion**: Smooth entry, exit, layout transitions, and micro-animations
- **React Dropzone**: Multi-file drag and drop file upload
- **React Icons & Lucide-React**: Dynamic vector icon design
- **Axios**: HTTP communication with backend API
- **React Hot Toast**: Action alerts and notifications

### Backend
- **Python / FastAPI**: Asynchronous high-performance REST APIs
- **Pillow**: Image loading and processing
- **ImageHash**: Multi-algorithm perceptual hashing (aHash, dHash, pHash, wHash)
- **ReportLab**: PDF report generation

---

## Folder Structure
```
Duplicate-Image-Detector/
├── backend/
│   ├── app/
│   │   ├── core/           # Configuration and global state
│   │   ├── routes/         # FastAPI endpoints for uploads & reports
│   │   ├── schemas/        # Pydantic schemas for data serialization
│   │   ├── services/       # Hashing and report exporters
│   │   ├── utils/          # Filename sanitizers and size formatting
│   │   └── main.py         # Entry point
│   ├── uploads/            # Temporary upload cache
│   ├── reports/            # Generated download reports
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components (Uploads, Stats, Cards, Modal)
│   │   ├── context/        # Theme state provider (Dark/Light mode)
│   │   ├── hooks/          # useDebounce search hook
│   │   ├── pages/          # Dashboard and Comparisons pages
│   │   ├── services/       # Axios API integration
│   │   ├── utils/          # Styling and numeric format helpers
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── package.json
│   └── index.html
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server:
   ```bash
   python -m backend.app.main
   ```
   The backend API will run on `http://localhost:8000`.

### Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload an image file, compute hashes, return details |
| `GET` | `/images` | Fetch list of all uploaded images |
| `GET` | `/results` | Fetch pairwise image similarities for the selected algorithm |
| `GET` | `/statistics` | Fetch dashboard analytics |
| `GET` | `/report/csv` | Download CSV formatted report |
| `GET` | `/report/json` | Download JSON formatted report |
| `GET` | `/report/pdf` | Download PDF formatted report |
| `DELETE`| `/images` | Reset workspace (delete all files and records) |

---

## How to Test Hashing & Similarity
1. Open the application at `http://localhost:5173`.
2. Click **Upload Images** on the dashboard.
3. Upload an original image.
4. Upload a modified copy of the same image (e.g. resized, slightly rotated, brightness changed, or compressed).
5. The dashboard statistics will immediately show the count of duplicate/similar images.
6. Click **Comparisons** in the navigation bar to see side-by-side matches.
7. Switch between `pHash`, `aHash`, `dHash`, and `wHash` using the algorithm drop-down to observe how different techniques evaluate similarity.
8. Click **PDF / CSV / JSON** to download comparison results.
