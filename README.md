# Project Management Tool

A comprehensive full-stack application designed to organize workspace environments and deeply track tasks. Built with a Node.js/Express backend API and a highly interactive React (Vite) frontend.

## Key Features

- **Workspace Management**: Create, update, and manage distinct project environments.
- **Task Tracking**: Detail-oriented task tracking nested under specific projects with due dates, priorities, and statuses.
- **Advanced Filtering & Sorting**: Contextually sort tasks by weighted properties (e.g. High > Medium > Low) and filter out noise.
- **Scalable Pagination**: Native pagination handling large datasets with adjustable rows-per-page.
- **Modern Architecture**: Clean frontend UI built heavily on React robust hook patterns and custom Shadcn UI integrations.

---

## Tech Stack

- **Language**: JavaScript (ES6+), JSX
- **Frontend**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Shadcn UI v4
- **Backend API**: Node.js + Express 5
- **Database**: MongoDB (via Mongoose 9)
- **Deployment**: Flexible (Vercel, Render, Railway, etc.)

---

## Prerequisites

Ensure your development environment meets the following requirements before proceeding:

- Node.js 20 or higher
- npm 10 or pnpm (recommended)
- A running MongoDB instance (Local server or MongoDB Atlas cluster)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Tushar-Sahu7/Project-Management-Tool.git
cd Project-Management-Tool
```

### 2. Install Backend Dependencies

Navigate to the backend server and install packages:

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

Open a second terminal window, navigate to the frontend, and install packages:

```bash
cd frontend
npm install
```

### 4. Environment Setup

The application requires specific environment variables to link the backend to the database, and the frontend to the backend.

**Backend Environment**
Duplicate `.env.example` (or create a `.env` file) in the `/backend` folder:
```bash
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/projects?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Frontend Environment**
Create a `.env` file in the `/frontend` folder:
```bash
VITE_API_URL=http://localhost:5000/api/v1
```

### 5. Start Development Servers

You will need to run both the API server and the Frontend bundler concurrently.

```bash
# Terminal 1: Backend Server
cd backend
npm run dev

# Terminal 2: Vite Dev Server
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Architecture

### Directory Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/       # Database & environment configurations
│   │   ├── controllers/  # Route logic and request handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express API route declarations
│   │   └── server.js     # Express app entry point
│   ├── package.json
│   └── README.md         # Dedicated API Documentation
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Modular React components
│   │   │   ├── projects/ # Project-specific UI (cards, forms)
│   │   │   ├── shared/   # Reusable UI (pagination, theme toggles)
│   │   │   ├── tasks/    # Task-specific UI (tables, filters)
│   │   │   └── ui/       # Raw Shadcn/Radix primitive components
│   │   ├── hooks/        # Custom React hooks containing logic (useTasks, useProjects)
│   │   ├── pages/        # Route-level container components
│   │   ├── services/     # Axios API wrapper functions
│   │   ├── App.jsx       # Root React Router provider
│   │   └── main.jsx      # Vite entry point
│   └── package.json
```

### Request Lifecycle

1. User clicks an interface trigger on the React Frontend.
2. The isolated `useTasks` or `useProjects` custom hook intercepts the call and modifies local loading states.
3. The hook dispatches an asynchronous call via `src/services/api.js` (Axios).
4. Express Router matches the endpoint in `backend/src/routes`.
5. The specific Controller performs validation and interfaces with MongoDB via Mongoose Models.
6. The Backend responds with structured JSON data (often wrapping a `meta` object for pagination).
7. The custom Frontend hook resolves the Promise, patches React state, and triggers unified DOM repaints.

### Database Schema

```text
projects
├── _id (ObjectId, PK)
├── name (String, required)
├── description (String)
├── createdAt (Date)
└── updatedAt (Date)

tasks
├── _id (ObjectId, PK)
├── title (String, required)
├── description (String)
├── status (Enum: "todo", "in-progress", "done")
├── priority (Enum: "low", "medium", "high")
├── dueDate (Date)
├── project (ObjectId, FK → projects, index: true)
├── createdAt (Date)
└── updatedAt (Date)
```

---

## Environment Variables

### Backend Configuration

| Variable         | Description                                   | Default |
| ---------------- | --------------------------------------------- | ------- |
| `PORT`           | The port the Express HTTP server binds to.    | `5000`  |
| `MONGO_URI`      | MongoDB connection string.                    | -       |
| `FRONTEND_URL`   | Used to explicitly configure Express CORS.    | `*`     |

### Frontend Configuration

| Variable         | Description                                   | Default |
| ---------------- | --------------------------------------------- | ------- |
| `VITE_API_URL`   | Where Axios sends all external data requests. | -       |

---

## Available Scripts

| Command | Location | Description |
| ------- | -------- | ----------- |
| `npm run dev` | `backend/` | Starts Express server with hot-reloading (via `--watch`). |
| `npm start` | `backend/` | Starts standard Node server for Production. |
| `npm run dev` | `frontend/` | Starts Vite dev server with strict React HMR. |
| `npm run build` | `frontend/` | Bunches minified React application for generic static hosting. |
| `npm run preview` | `frontend/` | Localy hosts the minified `dist/` bundle for testing. |

---

## API Documentation

For frontend consumers or integration builders, the API is definitively documented directly inside the backend ecosystem. 

👉 **[View the full REST API Documentation here](./backend/README.md)** 👈

---

## Deployment

### Deploying the Backend (Render / Railway)

1. Connect your Github repository to Render or Railway.
2. Select the `backend/` root directory.
3. Select Node environment.
4. Set the Build Command: `npm install`
5. Set the Start Command: `npm start`
6. Add your `MONGO_URI` mapping in the production environment settings.

### Deploying the Frontend (Vercel / Netlify)

1. Connect your Git repository.
2. Set the Root Directory to `frontend`.
3. The platform will automatically detect Vite (Build command: `npm run build`, Output directory: `dist`).
4. Set the Environmental Variable `VITE_API_URL` to point to your new Production Backend URL.

---

## Troubleshooting

### Connection Refused (MongoDB)
**Error**: Backend crashes with `MongooseServerSelectionError: connection refused`
**Solution**: Your `MONGO_URI` is likely misconfigured or pointing to a local `localhost:27017` daemon that isn't running. If using Atlas, ensure your Network Access allows your current IP address.

### Port In Use
**Error**: `EADDRINUSE: address already in use :::5000`
**Solution**: Another service is using port 5000. Either kill the competing service (`lsof -i :5000`) or update the `PORT` variable in your Backend `.env` and `VITE_API_URL` in your Frontend `.env`.

### API Returning 404
**Error**: React Developer Tools show API requests failing with `404 Not Found`.
**Solution**: Double check `VITE_API_URL`. Ensure it is perfectly suffixed with the trailing path (e.g. `http://localhost:5000/api/v1` instead of just `http://localhost:5000`).
