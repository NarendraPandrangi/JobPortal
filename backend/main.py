import sys, os
# Ensure D:\PyLibs (where pdfplumber/python-docx live) is on the path
_libs = r"D:\PyLibs"
if _libs not in sys.path:
    sys.path.insert(0, _libs)

import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
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

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
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
