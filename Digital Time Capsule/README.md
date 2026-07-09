# ChronosCapsule - Digital Time Capsule

ChronosCapsule is a modern, premium full-stack web application that allows users to store valuable digital memories—such as text letters, documents, photo galleries, and video files—sealed inside locked capsules. These memories remain completely encrypted and inaccessible until a chosen unlock date and time. Once the lock date is reached, the capsules automatically unseal, providing users with the ability to review, download, share, and export their memories.

## Features

- **Absolute Locked State Guards**: Messages, photos, and file attachments are strictly blurred and protected on the frontend and stripped on the backend API before the unlock date is reached.
- **Auto-unlock Countdown**: Live dashboard countdown updating every second, with auto-unseal triggers and confetti explosions upon unlock.
- **Public Feed sharing**: Share unlocked public capsules with the community, supported by category chips, searches, and pagination.
- **Comprehensive Upload Attachments**: Supports up to 5 multi-image uploads (JPEG/PNG/WEBP), optional video files (MP4), and documents (PDF).
- **Interactive Dashboard**: Statistics widgets, tabbed sorting, search consoles, and category badges.
- **Export capabilities**: Export unlocked memories and letters directly to a formatted PDF.
- **Toggle Favorites**: Bookmark/star important capsules.
- **Dark Mode / Light Mode**: Sleek modern typography and beautiful glassmorphism gradients adapting dynamically.

---

## Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **Form State**: React Hook Form
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Visuals**: Canvas Confetti

### Backend
- **Framework**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **Auth**: JSON Web Tokens (JWT) & BcryptJS
- **File Management**: Multer (disk storage storage layout)
- **Cookies**: Cookie Parser

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file (see [Environment Variables](#environment-variables) below).
4. Run the server in development mode:
   ```bash
   npm run dev
   ```

### 2. Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file.
4. Run the React application locally:
   ```bash
   npm run dev
   ```

---

## Environment Variables

### Backend (.env)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/digital_time_capsule
JWT_SECRET=super_secret_capsule_key_123!
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

---

## Project Folder Structure

```text
Digital Time Capsule/
├── backend/
│   ├── config/             # DB Connection Config
│   ├── controllers/        # Controllers (Auth, Capsule)
│   ├── middlewares/        # Middlewares (Auth, Upload, Error)
│   ├── models/             # Mongoose Schemas (User, Capsule)
│   ├── routes/             # Express Routers
│   ├── uploads/            # File storage upload directory
│   ├── .env
│   ├── package.json
│   └── server.js           # Express App entrypoint
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI Elements (Navbar, CapsuleCard, etc.)
    │   ├── contexts/       # Authentication State Contexts
    │   ├── hooks/          # Custom hooks (useAuth)
    │   ├── pages/          # Pages (Home, Dashboard, Details, etc.)
    │   ├── services/       # API Axios client instance
    │   ├── index.css       # Tailwind configuration + Custom classes
    │   └── main.jsx        # React root entry
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create user and receive token
- `POST /api/auth/login` - Verify user and return token
- `POST /api/auth/logout` - Clear auth cookies
- `GET /api/auth/profile` - Get logged-in user profile details
- `PUT /api/auth/profile` - Update user details (includes profile image upload)
- `PUT /api/auth/change-password` - Change password

### Time Capsules
- `GET /api/capsules` - Retrieve current user capsules (supports query searches/filters/sorts)
- `GET /api/capsules/public` - Browse public unlocked capsules (unauthenticated)
- `GET /api/capsules/:id` - View details of a specific capsule (owner checks + locking blur guards)
- `POST /api/capsules` - Create a new time capsule (multi-images, pdf, video uploads)
- `PUT /api/capsules/:id` - Update capsule details (allowed on locked status only)
- `DELETE /api/capsules/:id` - Deletes files and capsule entry
- `PUT /api/capsules/:id/favorite` - Toggle favorited status
