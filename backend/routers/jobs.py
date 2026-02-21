from fastapi import APIRouter, Query
from typing import Optional
from services.job_fetcher import fetch_jobs

router = APIRouter()


@router.get("/jobs")
async def get_jobs(
    skills: str = Query(default="", description="Comma-separated skills"),
    location: str = Query(default="", description="Job location"),
    experience: str = Query(default="", description="Experience level"),
    remote: bool = Query(default=False, description="Remote jobs only"),
):
    """
    Fetch jobs based on skills and filters.
    Returns: { jobs: [...], count: int }
    """
    skill_list = [s.strip() for s in skills.split(",") if s.strip()] if skills else []
    job_list = await fetch_jobs(skill_list, location, experience, remote)

    return {
        "success": True,
        "count": len(job_list),
        "jobs": job_list,
    }
