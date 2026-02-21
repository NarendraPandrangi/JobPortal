from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from services.parser import extract_text_from_bytes, extract_skills, generate_search_query

router = APIRouter()


@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Accept resume file directly (PDF or DOCX), parse skills in-memory.
    Returns: { skills: [...], query: "..." }
    """
    allowed = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
    # Accept by MIME or file extension
    is_pdf = file.content_type == "application/pdf" or (file.filename or "").lower().endswith(".pdf")
    is_docx = "word" in (file.content_type or "") or (file.filename or "").lower().endswith(".docx")

    if not (is_pdf or is_docx):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=422, detail="Uploaded file is empty.")

        text = extract_text_from_bytes(content, is_pdf=is_pdf)
        if not text.strip():
            raise HTTPException(status_code=422, detail="Could not extract text from resume.")

        skills = extract_skills(text)
        query = generate_search_query(skills)

        return {
            "success": True,
            "skills": skills,
            "query": query,
            "char_count": len(text),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")
