import sys, os

import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.routers import resume, jobs
except ImportError:
    from routers import resume, jobs

# ── Logging Setup ──────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s » %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("jobportal")

app = FastAPI(
    title="JobPortal API",
    description="AI-powered resume parsing and job matching backend",
    version="1.0.0",
)

# Allow React dev server + deployed frontend
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"→ {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"← {request.method} {request.url.path}  [{response.status_code}]")
    return response

app.include_router(resume.router, prefix="", tags=["Resume"])
app.include_router(jobs.router, prefix="", tags=["Jobs"])


@app.get("/")
def root():
    return {"status": "ok", "message": "JobPortal API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "healthy"}
