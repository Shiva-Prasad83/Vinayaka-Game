# 🐘 Ganesha Festival — Vinayaka Champion

A polished, family-friendly 3D Indian festival-management adventure game built with **React + Three.js** (frontend) and **Express + MongoDB** (backend).

---

## 🗂 Project Structure

```
Vinayaka Chavithi Gamee/
├── frontend/          # React + Vite + Three.js (deploy to Vercel)
├── backend/           # Express + MongoDB API  (deploy to Render)
└── .gitignore
```

---

## 🚀 Deployment

### Step 1 — Deploy the Backend to Render

1. Push this repository to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect your GitHub repo and set the **Root Directory** to `backend`.
4. Render will detect `render.yaml` automatically. Confirm these settings:

   | Setting | Value |
   |---------|-------|
   | Runtime | Node |
   | Build Command | `npm install --omit=dev` |
   | Start Command | `npm start` |
   | Health Check Path | `/api/health` |

5. Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `CLIENT_URL` | Your Vercel frontend URL (set after Step 2, or use a placeholder and update later) |
   | `NODE_ENV` | `production` |

6. Click **Deploy**. Once live, copy the URL — it looks like:
   `https://ganesha-festival-api.onrender.com`

> **Free-tier note:** Render's free web services sleep after 15 minutes of inactivity. The first request after sleep takes ~30 s. Upgrade to the **Starter** plan ($7/mo) for always-on hosting.

---

### Step 2 — Deploy the Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**.
2. Import your GitHub repo and set the **Root Directory** to `frontend`.
3. Vercel will detect `vercel.json` automatically. Confirm these settings:

   | Setting | Value |
   |---------|-------|
   | Framework | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install --legacy-peer-deps` |

4. Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | The Render backend URL from Step 1 (no trailing slash) |

   Example: `VITE_API_URL=https://ganesha-festival-api.onrender.com`

5. Click **Deploy**.
6. Copy the Vercel URL (e.g. `https://ganesha-festival.vercel.app`) and go back to Render to update the `CLIENT_URL` env var.

---

### Step 3 — Update MongoDB Atlas Network Access

In your Atlas dashboard:

- Go to **Network Access** → **Add IP Address**
- Add `0.0.0.0/0` (allow from anywhere) — required because Render's IPs change on each deploy.

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `CLIENT_URL` | ✅ | Comma-separated list of allowed frontend origins |
| `PORT` | Auto | Render sets this automatically |
| `NODE_ENV` | ✅ | Set to `production` on Render |

### Frontend (`frontend/.env.local` for dev / Vercel dashboard for prod)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ prod only | Full Render backend URL, no trailing slash |

---

## 💻 Local Development

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally **or** a MongoDB Atlas URI in `backend/.env`

### Backend
```bash
cd backend
cp .env.example .env          # fill in MONGO_URI and CLIENT_URL
npm install
npm run dev                   # starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev                   # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `localhost:5000` automatically. No `VITE_API_URL` needed locally.

---

## 🎮 Game Controls

| Platform | Move | Camera | Interact | Run | Jump | Pause |
|----------|------|--------|----------|-----|------|-------|
| PC | `W A S D` | Right-click drag | `E` | `Shift` | `Space` | `Esc` |
| Mobile | Left joystick | Swipe right side | INTERACT button | Push joystick far | JUMP button | ☰ button |

---

## 🏗 Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite 8, Three.js, React Three Fiber, Drei, Zustand, Tailwind CSS v4 |
| Backend | Node.js 18+, Express 5, Mongoose, Socket.IO, Helmet, Morgan |
| Database | MongoDB Atlas |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Key Files

```
frontend/
  vercel.json              # Vercel deployment config (SPA rewrites, caching)
  .env.example             # Documents required env vars
  vite.config.js           # Build config with vendor code splitting

backend/
  render.yaml              # Render deployment config
  .env.example             # Documents required env vars
  index.js                 # Express app entry point
```
