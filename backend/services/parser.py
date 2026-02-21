"""
Resume parsing service:
- Accepts raw bytes (PDF or DOCX)
- Extracts text in memory
- Detects skills using case-sensitive keyword matching to avoid false positives
"""

import re, io

# ── Skill List ────────────────────────────────────────────────────────────────
# Only include skills reliably written with consistent capitalisation in resumes.
# Removed ambiguous short names: C, R, Go, REST, OOP, Perl — they match inside
# normal English words (e.g. "go" → "good", "R" → "React", "C" → "Create").

SKILLS_LIST = [
    # Programming Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Golang",
    "Ruby", "PHP", "Swift", "Kotlin", "Scala", "MATLAB", "Dart",
    # Frontend
    "React", "Vue", "Angular", "Next.js", "Nuxt.js", "Svelte",
    "HTML", "CSS", "Sass", "Tailwind", "Bootstrap", "jQuery",
    "Redux", "Webpack", "Vite",
    # Backend
    "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot",
    "Laravel", "Rails", "ASP.NET", "NestJS", "GraphQL", "gRPC",
    # Databases
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra",
    "Elasticsearch", "SQLite", "Oracle", "DynamoDB", "Firestore", "Firebase",
    # Cloud & DevOps
    "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "Ansible",
    "Jenkins", "CI/CD", "GitHub Actions", "Linux", "Nginx", "Apache",
    # Data / ML / AI
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
    "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy",
    "Matplotlib", "Data Analysis", "Data Science", "LLM", "OpenAI",
    "Hugging Face",
    # Mobile
    "React Native", "Flutter", "Android", "iOS", "Expo",
    # Tools & Practices
    "Git", "GitHub", "Jira", "Agile", "Scrum", "Microservices",
    "System Design", "Algorithms", "Data Structures",
    # Testing
    "Jest", "Pytest", "Selenium", "Cypress", "Unit Testing",
]

# Skills with special characters that need custom regex
CUSTOM_PATTERNS: dict[str, str] = {
    "C++":            r"\bC\+\+\b",
    "C#":             r"\bC#\b",
    "Next.js":        r"\bNext\.js\b",
    "Nuxt.js":        r"\bNuxt\.js\b",
    "Node.js":        r"\bNode\.js\b",
    "Scikit-learn":   r"\bScikit[\-\s]learn\b",
    "CI/CD":          r"\bCI[/\-]CD\b",
    "ASP.NET":        r"\bASP\.NET\b",
    "GitHub Actions": r"\bGitHub\s+Actions\b",
    "React Native":   r"\bReact\s+Native\b",
    "Machine Learning": r"\bMachine\s+Learning\b",
    "Deep Learning":  r"\bDeep\s+Learning\b",
    "Computer Vision": r"\bComputer\s+Vision\b",
    "Data Analysis":  r"\bData\s+Analysis\b",
    "Data Science":   r"\bData\s+Science\b",
    "Data Structures": r"\bData\s+Structures\b",
    "System Design":  r"\bSystem\s+Design\b",
    "Unit Testing":   r"\bUnit\s+Testing\b",
    "Hugging Face":   r"\bHugging\s+Face\b",
    "Spring Boot":    r"\bSpring\s+Boot\b",
}

# Pre-compile all patterns — case-SENSITIVE (no re.IGNORECASE)
SKILL_PATTERNS: list[tuple[str, re.Pattern]] = []
for skill in SKILLS_LIST:
    if skill in CUSTOM_PATTERNS:
        pat = re.compile(CUSTOM_PATTERNS[skill])
    else:
        pat = re.compile(r"\b" + re.escape(skill) + r"\b")
    SKILL_PATTERNS.append((skill, pat))


# ── Text Extraction ──────────────────────────────────────────────────────────

def extract_text_from_bytes(content: bytes, is_pdf: bool = True) -> str:
    """Extract text from raw file bytes."""
    if is_pdf:
        return _extract_pdf_text(content)
    else:
        return _extract_docx_text(content)


def _extract_pdf_text(content: bytes) -> str:
    """Extract plain text from PDF bytes using pdfplumber."""
    import pdfplumber
    pages = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                pages.append(t)
    return "\n".join(pages)


def _extract_docx_text(content: bytes) -> str:
    """Extract plain text from DOCX bytes."""
    from docx import Document
    doc = Document(io.BytesIO(content))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())


# ── Skill Extraction ─────────────────────────────────────────────────────────

def extract_skills(text: str) -> list[str]:
    """
    Detect tech skills using case-sensitive word-boundary matching.
    Only returns skills whose exact casing appears in the resume text.
    This prevents false positives like 'Go' matching 'good', 'C' matching 'Create'.
    """
    found = set()
    for skill, pattern in SKILL_PATTERNS:
        if pattern.search(text):
            found.add(skill)
    # Return in canonical SKILLS_LIST order
    return [s for s in SKILLS_LIST if s in found]


def generate_search_query(skills: list[str]) -> str:
    """Create a job search query string from the top extracted skills."""
    return " ".join(skills[:5]) if skills else "software developer"
