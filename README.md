# CodeInterview.AI – Code Interview Simulator

A full‑stack web app for practicing coding interviews with AI assistance. Users sign up, solve problems in a Monaco editor, run tests (demo), and get AI help (hints/explanations/debug/optimize) powered by IBM Granite via Replicate.

## 🔎 What this project is

- Practice coding interview problems with a familiar UI.
- AI assistant for contextual help (free‑form chat and quick actions).
- Firebase Authentication + Firestore (profile and future analytics).
- React + Tailwind frontend; Express backend proxy to Granite.

## 🏗️ Architecture (high‑level)

- Frontend (React + TypeScript)
  - Routing (protected routes), Monaco editor, Tailwind UI
  - Firebase Auth/Firestore client
  - Calls Backend `/api/ai` (Granite via Replicate)
  - Calls Backend `/api/execute` (demo executor)
- Backend (Node + Express)
  - `/api/ai` → Replicate (IBM Granite model)
  - `/api/execute` → Demo code execution (JS eval; Python mocked)
  - Helmet/CORS/Morgan; `.env` via dotenv
- Firebase
  - Auth (Email/Password)
  - Firestore (long‑polling enabled to avoid WebChannel 400 on strict networks)

```
Frontend (React)  <——>  Backend (Express)  <——>  Replicate (IBM Granite)
        |                    |
   Firebase Auth         Demo executor (/api/execute)
   Firestore (client)    (JS eval, Python mock)
```

## 🧰 Tech Stack

- Frontend: React 19, TypeScript, React Router, Tailwind CSS, Monaco Editor, Firebase (auth/firestore)
- Backend: Node.js/Express, Helmet, CORS, Morgan, dotenv, Replicate SDK
- Tooling: CRA (react-scripts), PostCSS, Autoprefixer

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended LTS)
- NPM
- Firebase project (enable Email/Password, Firestore)
- Replicate account + API token (for Granite)

### 1) Backend

```
cd backend
npm install
```

Create `backend/.env` (see `backend/ENV_SAMPLE.txt`):

```
REPLICATE_API_TOKEN=your_token_here
GRANITE_MODEL=ibm-granite/granite-3.0-8b-instruct  # or 3.3 model
PORT=5000
```

Run:

```
node index.js
# Health: http://localhost:5000/health
# AI:     POST http://localhost:5000/api/ai
```

### 2) Frontend

```
cd frontend
npm install
```

Optional `.env` in `frontend/` (if backend port differs):

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

Run:

```
npm start
```

Open `http://localhost:3000`.

## ✨ Key Features

- Authentication (signup/login), protected routes, global loading
- Problems list and detailed problem view
- Monaco editor with language switching
- Test results panel (demo data for now)
- **Multi-language (i18n) support:**
  - Full Bahasa Indonesia & English translation
  - Language switcher in Navbar (instant switch, no reload)
- AI Assistant:
  - Quick actions: Hint / Explain / Debug / Optimize → Granite
  - Manual chat (free‑form) → Granite
  - Graceful fallback to mock when Granite unavailable
- **UI/UX improvements:**
  - Responsive layout, modern look, better button spacing
  - Consistent theme and color
- **Bugfixes & Optimization:**
  - React context & dependency issues resolved
  - Only one node_modules per app (no duplicate React)
  - All translation keys always in sync

## 🌐 Multi-language (i18n) Usage

- Switch language via the button in the Navbar (EN/ID)
- All main pages and UI elements are fully translated
- To add a new language:
  1. Copy `frontend/src/locales/en.json` to `xx.json` (xx = language code)
  2. Translate the values
  3. Register the new language in `frontend/src/i18n.ts`

## ⚙️ Configuration Notes

- Firebase config lives in `frontend/src/services/firebase.ts`.
  - Uses `initializeFirestore(..., { experimentalForceLongPolling: true })` to avoid WebChannel 400 in strict networks.
- API base URL lives in `frontend/src/config.ts` via `REACT_APP_API_BASE_URL`.
- Backend Granite proxy lives in `backend/index.js` (`/api/ai`).

## 🛡️ Security Considerations

- Granite API key is only used on the backend (safe).
- Demo code executor uses `eval` for JavaScript and mocked Python — not safe for production.

## 🚦 Demo vs Production

- Demo:
  - `/api/execute` uses in‑process eval (JS) and a Python mock.
  - AI fallback: if Replicate not configured, `/api/ai` returns a friendly mock 200 response.
- Production (suggested):
  - Dockerized sandbox executor (Node, Python, Java, C++), time/memory limits, process isolation
  - Database for submissions, results, analytics
  - Rate limiting, auth tokens for API, observability

## ✅ Optimizations already implemented

- Auth UX: non‑blocking Firestore writes on signup, immediate UI update
- Global loading gates (avoid “auto‑logout on refresh” flash)
- Firestore long‑polling to bypass network/proxy issues
- AI proxy with graceful fallback (never 500 to UI)

## ⚠️ Limitations (current)

- Code execution is a demo (JS eval, Python mocked). Not secure.
- Submissions aren’t persisted server‑side yet.
- No streaming AI responses yet.
- Limited test coverage.

## 🗺️ Roadmap / Future Work

- Secure, containerized code execution with per‑language runtimes
- Persist submissions, attempts, analytics, and leaderboards
- Markdown rendering for AI output and better chat UX
- Role‑based access (admin/problem editor)
- Rate limiting + monitoring/telemetry
- Problem import/export and tagging improvements

## 📁 Project Structure (simplified)

_Note: Only install dependencies in `frontend/` and `backend/` folders. Do not use node_modules in root._

```
code-interview-simulator/
├── backend/
│   ├── index.js               # Express server (AI proxy, demo executor)
│   ├── package.json
│   ├── ENV_SAMPLE.txt         # .env template for Replicate
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── pages/             # Home, Login, Dashboard, Problems, Interview
│   │   ├── components/        # Navbar, ProtectedRoute, CodeEditor, etc.
│   │   ├── contexts/          # AuthContext
│   │   ├── services/          # firebase.ts, aiServices.ts
│   │   └── config.ts          # API base URL
│   ├── package.json
│   └── tailwind.config.js
└── shared/
```

## 🔧 Useful Commands

- Backend
  - `cd backend && node index.js`
- Frontend
  - `cd frontend && npm start`

## 🧪 Quick Verification

- Check Granite connectivity:

```
fetch('http://localhost:5000/api/ai', {
  method: 'POST', headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ prompt: 'Give me a hint for Two Sum in JS' })
}).then(r=>r.json()).then(console.log)
```

- In Interview page: try Hint/Explain/Debug/Optimize or send a free‑form chat message.

## 🆘 Troubleshooting

- Port already in use: kill process or change `PORT` in `backend/.env` and update `REACT_APP_API_BASE_URL`.
- Firestore 400/WebChannel errors: already using long‑polling; also disable ad‑block/VPN if needed.
- AI 500 errors: set `REPLICATE_API_TOKEN` and restart backend; otherwise UI gets a mock response.

---

Made with ❤️ for coding interview practice and fast demos.
