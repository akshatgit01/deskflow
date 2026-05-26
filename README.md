# DeskFlow — Support Ticket Triage Board

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

A production-ready MERN stack support ticket triage board. Create, track, and resolve support tickets with real-time SLA monitoring, priority-based colour coding, and a smooth Kanban-style workflow.

---

## ✨ Features

- **Kanban Board** — 4-column workflow: Open → In Progress → Resolved → Closed
- **SLA Monitoring** — Automatic breach detection based on ticket priority
- **Priority Levels** — Low, Medium, High, Urgent with distinct visual indicators
- **Status Transitions** — Enforced forward & backward transitions (no illegal jumps)
- **Combinable Filters** — Filter by priority and/or SLA breach status simultaneously
- **Stats Strip** — Live counts refreshed after every mutation
- **Dark Mode** — Sleek dark-first design with glassmorphism accents
- **Responsive** — Horizontal scroll on mobile, 2-col tablet, 4-col desktop

---

## 🚀 Local Setup

### Prerequisites
- Node.js ≥ 18
- A MongoDB Atlas cluster (or local MongoDB)

### 1 — Clone the repo

```bash
git clone https://github.com/akshatgit01/deskflow.git
cd deskflow
```

### 2 — Backend

```bash
cd backend
npm install
cp .env.example .env        # Fill in your MONGODB_URI
npm run dev                 # Starts on http://localhost:5000
```

### 3 — Frontend

```bash
cd frontend
npm install
# No .env needed in dev — Vite proxy forwards /api → localhost:5000
npm run dev                 # Starts on http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                              | Example                                         |
|----------------|------------------------------------------|-------------------------------------------------|
| `PORT`         | Port for the Express server              | `5000`                                          |
| `MONGODB_URI`  | MongoDB connection string                | `mongodb+srv://user:pass@cluster.mongodb.net/deskflow` |
| `FRONTEND_URL` | Allowed CORS origin in production        | `https://your-app.netlify.app`                  |
| `NODE_ENV`     | Environment mode                         | `development` / `production`                    |

### Frontend (`frontend/.env`)

| Variable        | Description                 | Example                                       |
|-----------------|-----------------------------|-----------------------------------------------|
| `VITE_API_URL`  | Backend API base URL        | `https://deskflow-api.onrender.com/api`       |

---

## 📡 API Endpoints

| Method   | Endpoint                  | Description                                      |
|----------|---------------------------|--------------------------------------------------|
| `POST`   | `/api/tickets`            | Create a new ticket                              |
| `GET`    | `/api/tickets`            | List tickets (supports `?status`, `?priority`, `?breached=true`) |
| `PATCH`  | `/api/tickets/:id`        | Update ticket status (enforces transition rules) |
| `DELETE` | `/api/tickets/:id`        | Delete a ticket                                  |
| `GET`    | `/api/tickets/stats`      | Get counts by status, priority, and SLA breaches |

### SLA Targets

| Priority | SLA Target |
|----------|-----------|
| Urgent   | 1 hour    |
| High     | 4 hours   |
| Medium   | 24 hours  |
| Low      | 72 hours  |

### Status Transition Rules

```
open        → in_progress
in_progress → open | resolved
resolved    → in_progress | closed
closed      → (terminal — no moves)
```

---

## ☁️ Deployment

### Backend → Render.com

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo, set **Root Directory** to `backend`
3. Set **Build Command**: `npm install` | **Start Command**: `node server.js`
4. Add environment variables: `MONGODB_URI`, `FRONTEND_URL`, `NODE_ENV=production`
5. Your API will be at: `https://deskflow-api.onrender.com`

### Frontend → Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Select your repo; Netlify auto-detects `frontend/netlify.toml`
3. Add environment variable: `VITE_API_URL=https://deskflow-api.onrender.com/api`
4. Deploy — your app will be at: `https://deskflow.netlify.app`

### Post-deployment
After both are live, go back to Render and set `FRONTEND_URL` to your actual Netlify URL, then trigger a redeploy to lock down CORS.

---

## 📸 Screenshots

> _Add screenshots here after first deployment_

---

## 📄 License

MIT
