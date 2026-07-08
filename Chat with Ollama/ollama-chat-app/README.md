# Local Ollama AI Chat Application

A premium, modern AI chat interface styled with a beautiful Green Liquid Glass UI. It runs locally and communicates with a local Ollama service.

## Project Structure

```text
ollama-chat-app/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── .env.example
├── frontend/
│   ├── package.json
│   └── src/
└── README.md
```

## Running the Application

### 1. Start Ollama
Ensure you have Ollama installed, then run the following commands:
```bash
ollama serve
ollama pull llama3.2
```

### 2. Run Backend
```bash
cd backend
npm install
npm start
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at the port output by the frontend Vite development server (typically `http://localhost:3000`).
