"""
Resume parsing service:
- Accepts raw bytes (PDF or DOCX)
- Extracts text in memory
- Detects skills using keyword matching
"""

import re, io, sys
_libs = r"D:\PyLibs"
if _libs not in sys.path:
    sys.path.insert(0, _libs)

# Comprehensive tech/professional skills list
SKILLS_LIST = [
    # Programming Languages
    "Python", "JavaScript", "TypeScript", "Java", "C", "C++", "C#", "Go", "Rust",
    "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Dart",
    # Frontend
    "React", "Vue", "Angular", "Next.js", "Nuxt.js", "Svelte", "HTML", "CSS",
    "Sass", "Tailwind", "Bootstrap", "jQuery", "Redux", "Webpack", "Vite",
    # Backend
    "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot", "Laravel",
    "Rails", "ASP.NET", "NestJS", "GraphQL", "REST APIs", "gRPC",
    # Databases
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "Elasticsearch",
    "SQLite", "Oracle", "DynamoDB", "Firestore", "Firebase",
    # Cloud & DevOps
    "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "Ansible",
    "Jenkins", "CI/CD", "GitHub Actions", "Linux", "Nginx", "Apache",
    # Data / ML / AI
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow",
    "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy", "Matplotlib",
    "Data Analysis", "Data Science", "LLM", "OpenAI", "Hugging Face",
    # Mobile
    "React Native", "Flutter", "Android", "iOS", "Expo",
    # Tools & Practices
    "Git", "GitHub", "Jira", "Agile", "Scrum", "REST", "Microservices",
    "System Design", "OOP", "Algorithms", "Data Structures",
    # Testing
    "Jest", "Pytest", "Selenium", "Cypress", "Unit Testing",
]

# Build lowercase lookup for fast matching
SKILLS_LOWER = {s.lower(): s for s in SKILLS_LIST}


def extract_text_from_bytes(content: bytes, is_pdf: bool = True) -> str:
    """Extract text from raw file bytes (PDF or DOCX)."""
    if is_pdf:
        return _extract_pdf_text(content)   # raises on failure — no docx fallback
    else:
        return _extract_docx_text(content)  # raises on failure — no pdf fallback



def _extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF bytes."""
    import pdfplumber
    text_parts = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text_parts.append(t)
    return "\n".join(text_parts)


def _extract_docx_text(content: bytes) -> str:
    """Extract text from DOCX bytes."""
    from docx import Document
    doc = Document(io.BytesIO(content))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())


def extract_skills(text: str) -> list[str]:
    """
    Detect tech skills from resume text using keyword matching.
    Uses whole-word boundary matching to avoid false positives.
    """
    found = set()
    text_lower = text.lower()

    for skill_lower, skill_original in SKILLS_LOWER.items():
        # Use word boundary matching
        pattern = r"\b" + re.escape(skill_lower) + r"\b"
        if re.search(pattern, text_lower):
            found.add(skill_original)

    # Sort by most common / important first (order of SKILLS_LIST)
    ordered = [s for s in SKILLS_LIST if s in found]
    return ordered


def generate_search_query(skills: list[str]) -> str:
    """Create a human-readable job search query from skills."""
    if not skills:
        return "software developer"
    # Take top 5 most specific skills
    top = skills[:5]
    return " ".join(top)
