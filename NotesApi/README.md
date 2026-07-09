# Notes API Dockerized

A production-ready, lightweight, containerized RESTful API built with **Node.js**, **Express.js**, and **Docker**. This project implements a clean architecture and uses local file-based storage with robust error handling and API validations.

---

## Features

- **Full CRUD operations**: Create, Read, Update, and Delete notes.
- **Data Persistence**: Uses a lightweight JSON file database mapping (`data/notes.json`) with safe async I/O.
- **Robust Validations**: Enforces non-empty title and content, sanitizing white space.
- **Containerized Environment**: Full Docker and Docker Compose configuration.
- **Centralized Error Handling**: Integrated 404 Route handler and global error recovery middleware.
- **Security Primitives**: Pre-configured with Helmet for secure HTTP headers and CORS for Cross-Origin Resource Sharing.

---

## Folder Structure

```text
notes-api-docker/
├── controllers/
│   └── notesController.js   # Contains CRUD route handler logics
├── data/
│   └── notes.json           # Local JSON file acting as database
├── middleware/
│   ├── errorHandler.js      # Global error and response formatter
│   └── notFound.js          # Handles 404 Route Not Found errors
├── routes/
│   └── notesRoutes.js       # Defines API route endpoints
├── utils/
│   └── fileHelper.js        # Helper functions for filesystem operations
├── .dockerignore            # List of files ignored by Docker builder
├── .env                     # Production/Development environment variables
├── .env.example             # Template file for environment setup
├── .gitignore               # Ignored files for version control
├── docker-compose.yml       # Docker Compose multi-container configuration
├── Dockerfile               # Build instructions for Alpine node image
├── package.json             # NPM project metadata and dependencies
├── server.js                # Core entry point setting up Express app
└── README.md                # Project documentation
```

---

## Environment Variables

The application configures its environment using a `.env` file at the root.

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `PORT` | The port the Express server will listen on | `5000` |
| `NODE_ENV` | Mode of execution (`development` or `production`) | `development` |

---

## Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) and/or [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.

Clone the repository and navigate into the project directory:
```bash
git clone <repository-url>
cd notes-api-docker
```

### Run Without Docker

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup Environment**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. **Run in Development Mode** (using nodemon):
   ```bash
   npm run dev
   ```
4. **Run in Production Mode**:
   ```bash
   npm start
   ```

---

## Running with Docker

### Build Docker Image

Build the optimized lightweight docker image:
```bash
docker build -t notes-api .
```

### Run Docker Container

Start the container and map the configured port (e.g., `5000`):
```bash
docker run -p 5000:5000 --env-file .env notes-api
```

### Run Docker Compose (Recommended)

Run the application with one command. This automatically sets up environment variables and configures a persistent volume:
```bash
docker compose up -d
```
To stop the services:
```bash
docker compose down
```

---

## API Endpoints

All responses are returned as structured JSON.

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | API Welcome message & details | `200` |
| **GET** | `/api/notes` | Retrieve all notes | `200` |
| **GET** | `/api/notes/:id` | Retrieve a single note by ID | `200`, `404` |
| **POST** | `/api/notes` | Create a new note | `201`, `400` |
| **PUT** | `/api/notes/:id` | Update an existing note by ID | `200`, `400`, `404` |
| **DELETE** | `/api/notes/:id`| Delete a note by ID | `200`, `404` |

---

## Example Requests & Responses

### 1. Create a Note (`POST /api/notes`)

**Request Body**:
```json
{
  "title": "Docker Setup",
  "content": "Learn how to build lightweight node application images."
}
```

**Response (`201 Created`)**:
```json
{
  "id": "6c8452bf-7c01-44af-8b1e-f38b4d812328",
  "title": "Docker Setup",
  "content": "Learn how to build lightweight node application images.",
  "createdAt": "2026-07-09T13:30:00.000Z",
  "updatedAt": "2026-07-09T13:30:00.000Z"
}
```

---

### 2. Get All Notes (`GET /api/notes`)

**Response (`200 OK`)**:
```json
[
  {
    "id": "6c8452bf-7c01-44af-8b1e-f38b4d812328",
    "title": "Docker Setup",
    "content": "Learn how to build lightweight node application images.",
    "createdAt": "2026-07-09T13:30:00.000Z",
    "updatedAt": "2026-07-09T13:30:00.000Z"
  }
]
```

---

### 3. Error Handling Example (`POST /api/notes` - Title empty)

**Request Body**:
```json
{
  "title": "",
  "content": "Content here"
}
```

**Response (`400 Bad Request`)**:
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Title cannot be empty",
  "stack": null
}
```

---

## Testing Instructions

You can test the API endpoints using **Postman**, **Thunder Client** (VS Code extension), or standard command-line tools like `curl`.

### Test with `curl`

- **Create a Note**:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"title":"Test Note","content":"This is a test note."}' http://localhost:5000/api/notes
  ```
- **Get All Notes**:
  ```bash
  curl http://localhost:5000/api/notes
  ```

---

## Future Improvements

- Add database adapters (e.g., PostgreSQL or MongoDB) using the Repository pattern.
- Integrate unit and integration testing suite (e.g., Jest and Supertest).
- Add user authentication and authorization using JWT.

---

## License

This project is licensed under the [MIT License](LICENSE).
