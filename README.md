# 💼 JobPortal — AI-Powered Resume Matching

An intelligent job portal that parses your resume, extracts skills using NLP, and matches you with the best job opportunities in real-time.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Storage%20%7C%20Firestore-FFCA28?logo=firebase)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **Resume Upload** | Drag & drop PDF/DOCX — parsed instantly |
| 🧠 **AI Skill Extraction** | NLP-powered skill detection using spaCy |
| 🔍 **Smart Job Matching** | Searches live jobs from Adzuna / JSearch APIs |
| 💬 **Chat Interface** | Conversational UI for browsing matched jobs |
| 🎛️ **Advanced Filters** | Filter by location, experience level, and remote |
| 👤 **User Profiles** | Firebase Auth with upload history tracking |
| ☁️ **Cloud Storage** | Resumes stored securely in Firebase Storage |

---

## 🏗️ Tech Stack

### Frontend
- **React 19** + **Vite** — Lightning-fast dev server & builds
- **React Router v7** — Client-side routing with protected routes
- **Framer Motion** — Smooth animations and transitions
- **React Dropzone** — Drag & drop file uploads
- **Axios** — HTTP client for API calls
- **Firebase SDK** — Auth, Firestore, Storage, Analytics

### Backend
- **FastAPI** — Modern async Python API framework
- **spaCy** — NLP engine for skill extraction from resumes
- **pdfplumber** — PDF text extraction
- **python-docx** — DOCX text extraction
- **httpx** — Async HTTP client for job API calls
- **Uvicorn** — ASGI server

### External APIs
- **Adzuna API** — Live job listings (default)
- **JSearch API** (RapidAPI) — Alternative job source
- **Demo mode** — Built-in sample data for testing

---

## 📁 Project Structure

```
JobPortal/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment variable template
│   ├── routers/
│   │   ├── resume.py           # POST /parse-resume endpoint
│   │   └── jobs.py             # GET /jobs endpoint
│   └── services/
│       ├── parser.py           # Resume text extraction & NLP skill parsing
│       └── job_fetcher.py      # Adzuna / JSearch API integration
│
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx             # Routes & auth state management
│   │   ├── firebase.js         # Firebase config & SDK exports
│   │   ├── index.css           # Global design system & tokens
│   │   ├── main.jsx            # React entry point
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── FilterPanel.jsx # Job filter controls
│   │   │   └── JobCard.jsx     # Individual job listing card
│   │   └── pages/
│   │       ├── HomePage.jsx    # Landing page
│   │       ├── AuthPage.jsx    # Login / Sign up
│   │       ├── UploadPage.jsx  # Resume upload & job matching chat
│   │       └── ProfilePage.jsx # User profile & upload history
│   └── ...
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** & npm
- **spaCy English model**: `python -m spacy download en_core_web_sm`

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/JobPortal.git
cd JobPortal
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Configure environment
cp .env.example .env
# Edit .env with your API keys (or leave JOB_SOURCE=demo for testing)

# Start the server
python -m uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Adzuna API (https://developer.adzuna.com)
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

# JSearch via RapidAPI (https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
RAPIDAPI_KEY=your_rapidapi_key

# Active job source: "adzuna" | "jsearch" | "demo"
JOB_SOURCE=demo
```

> **Tip:** Set `JOB_SOURCE=demo` to run without any API keys using built-in sample data.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check — returns API status |
| `GET` | `/health` | Health check endpoint |
| `POST` | `/parse-resume` | Upload resume (PDF/DOCX) → returns extracted skills |
| `GET` | `/jobs` | Fetch jobs by skills, location, experience, remote |

### Example: Parse Resume

```bash
curl -X POST http://localhost:8000/parse-resume \
  -F "file=@resume.pdf"
```

### Example: Search Jobs

```bash
curl "http://localhost:8000/jobs?skills=React,Python&location=Bangalore&remote=true"
```

---

## 🔐 Firebase Setup

This project uses Firebase for authentication, file storage, and data persistence.

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Enable **Cloud Firestore**
4. Enable **Cloud Storage**
5. Update `frontend/src/firebase.js` with your Firebase config

---

## 🎨 Design

The UI uses a **dark glassmorphism** design with:
- Custom CSS design tokens (no framework dependency)
- Animated gradient backgrounds with floating orbs
- Smooth micro-animations via Framer Motion
- Google Fonts: **Inter** (body) + **Outfit** (headings)
- Indigo/violet accent color palette

---

## 🚀 Deploy to Vercel

### Frontend (Vercel)

1. **Push your code** to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Set the **Root Directory** to `frontend`
4. Framework Preset will auto-detect **Vite**
5. Add the environment variable:
   | Name | Value |
   |------|-------|
   | `VITE_BACKEND_URL` | Your deployed backend URL (e.g. `https://jobportal-api.onrender.com`) |
6. Click **Deploy** ✅

> The `vercel.json` in the frontend folder handles SPA rewrites so React Router works correctly.

### Backend (Render — Recommended)

The backend uses **spaCy NLP models** (~30MB+) which are too large for Vercel serverless functions. Deploy it on **[Render](https://render.com)** instead:

1. Go to [render.com](https://render.com) → **New Web Service** → Connect your repo
2. Set **Root Directory** to `backend`
3. **Build Command:**
   ```bash
   pip install -r requirements.txt && python -m spacy download en_core_web_sm
   ```
4. **Start Command:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Add environment variables: `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `JOB_SOURCE`
6. Copy the Render URL → paste it as `VITE_BACKEND_URL` in your Vercel project settings

> **Alternatives:** [Railway](https://railway.app), [Fly.io](https://fly.io), or any VPS.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using React, FastAPI, and AI
</p>
