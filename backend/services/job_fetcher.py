"""
Job fetching service.
Supports: Adzuna API, JSearch (RapidAPI), or Demo data.
Configure JOB_SOURCE in .env
"""

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

JOB_SOURCE = os.getenv("JOB_SOURCE", "demo")
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY", "")
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")


async def fetch_jobs(skills: list[str], location: str = "", experience: str = "", remote: bool = False) -> list[dict]:
    """Fetch jobs based on detected skills."""
    if JOB_SOURCE == "jsearch" and RAPIDAPI_KEY:
        return await _fetch_jsearch(skills, location, remote)
    return await _fetch_adzuna(skills, location, remote)


async def _fetch_adzuna(skills: list[str], location: str, remote: bool) -> list[dict]:
    """Fetch from Adzuna Jobs API."""
    query = " ".join(skills[:4])
    if remote:
        query += " remote"

    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": 20,
        "what": query,
        "content-type": "application/json",
    }
    if location:
        params["where"] = location

    country = "in"  # India
    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()

        jobs = []
        for item in data.get("results", []):
            title = item.get("title", "Software Developer")
            desc  = item.get("description", "")
            jobs.append({
                "title":      title,
                "company":    item.get("company", {}).get("display_name", "Company"),
                "location":   item.get("location", {}).get("display_name", "India"),
                "url":        item.get("redirect_url", "#"),
                "salary":     _format_salary(item.get("salary_min"), item.get("salary_max")),
                "remote":     "remote" in title.lower() or "remote" in desc.lower(),
                "experience": "",
                "skills":     skills[:3],
            })

        return jobs

    except Exception as e:
        raise Exception(f"Adzuna API error: {e}")



async def _fetch_jsearch(skills: list[str], location: str, remote: bool) -> list[dict]:
    """Fetch from JSearch API via RapidAPI."""
    query = " ".join(skills[:3]) + (" remote" if remote else "")
    if location:
        query += f" {location}"

    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
    params = {"query": query, "page": "1", "num_pages": "1", "country": "in"}

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url, headers=headers, params=params)
        resp.raise_for_status()
        data = resp.json()

    jobs = []
    for item in data.get("data", []):
        jobs.append({
            "title": item.get("job_title", "Developer"),
            "company": item.get("employer_name", "Company"),
            "location": item.get("job_city", "") or item.get("job_country", "India"),
            "url": item.get("job_apply_link", "#"),
            "salary": _format_salary(item.get("job_min_salary"), item.get("job_max_salary")),
            "remote": item.get("job_is_remote", False),
            "experience": item.get("job_required_experience", {}).get("required_experience_in_months", ""),
            "skills": item.get("job_required_skills", skills[:3]) or skills[:3],
        })
    return jobs


def _format_salary(min_sal, max_sal) -> str:
    if not min_sal and not max_sal:
        return ""
    if min_sal and max_sal:
        return f"₹{int(min_sal):,} – ₹{int(max_sal):,}"
    if min_sal:
        return f"₹{int(min_sal):,}+"
    return ""



