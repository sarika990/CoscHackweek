# Live Collaborative White Board

A premium real-time collaborative whiteboard built using React, Fabric.js, Node.js, Express, and Socket.IO.

## Prerequisites

Before running the application, make sure you have the following installed:
- **Node.js** (v18.x or higher recommended)
- **npm** (comes with Node.js) or **yarn**

---

## Installation

You need to install dependencies for both the backend and frontend parts of the application.

### 1. Install Backend Dependencies
Navigate to the `backend` directory and run:
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
Navigate to the `frontend` directory and run:
```bash
cd frontend
npm install
```

---

## Running the Application

To test the application locally, you must run both the backend server and the frontend development server.

### 1. Start the Backend Server
From the `backend` directory, run:
```bash
npm run dev
```
- The backend server runs by default on port `4000`.
- Socket.IO connection is initialized on `http://localhost:4000`.

### 2. Start the Frontend Development Server
From the `frontend` directory, run:
```bash
npm run dev
```
- The Vite server will start and typically run on `http://localhost:5173`.

---

## How to Test Collaboration Locally

You can easily simulate and test the request-based collaboration flow on a single machine:

1. **Open Two Browser Tabs**:
   - Go to `http://localhost:5173` in Tab 1.
   - Go to `http://localhost:5173` in Tab 2.
2. **Enter Names**:
   - In Tab 1, enter a name (e.g., "Alice") and click Join.
   - In Tab 2, enter a name (e.g., "Bob") and click Join.
3. **Copy/Note the User ID**:
   - Note Alice's ID (e.g., `ALICE-1234`) and Bob's ID (e.g., `BOB-5678`) in the "Collaboration" section of the right sidebar.
4. **Search and Request**:
   - In Alice's tab (Tab 1), type Bob's ID or name in the **Search by ID or Name...** input.
   - Click the **Request** button next to Bob's user card.
   - Alice's button will immediately change to **Pending...** (disabled).
5. **Accept Request**:
   - In Bob's tab (Tab 2), under the "Requests" panel in the sidebar, Alice's incoming collaboration request card will appear.
   - Click **Accept**.
6. **Collaboration State**:
   - Alice's button will change to **Accepted** briefly before the list transitions.
   - Both tabs' workspace labels (in the top navbar) will change from **Solo Workspace** to **Collaborative Workspace (Collaborating with: [PartnerName])**.
   - A Socket.IO room is formed.
7. **Draw and Sync**:
   - Draw, add shapes, or erase on Alice's canvas. The actions will immediately sync to Bob's canvas in real time, and vice versa.
   - You will also see live cursor paths overlayed with your collaborator's name!
8. **Disconnect**:
   - Click **Disconnect** in either sidebar to revert both tabs back to a "Solo Workspace" and release the users' status to 'online'.

---

## Environment Variables

### Frontend (`frontend/.env`)
- `VITE_SOCKET_URL`: URL of the backend socket server (Default: `http://localhost:4000`)

### Backend (`backend/.env`)
- `PORT`: Port on which the backend server runs (Default: `4000`)
