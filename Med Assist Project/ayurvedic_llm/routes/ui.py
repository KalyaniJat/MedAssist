# ayurvedic_llm/routes/ui.py
from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from pathlib import Path

router = APIRouter()

@router.get("/ui", response_class=HTMLResponse)
def ui():
    # Resolve path relative to the package (this file)
    pkg_dir = Path(__file__).resolve().parents[1]
    html_path = pkg_dir / "templates" / "ui.html"
    if not html_path.exists():
        # Helpful error so you can see what's wrong in logs
        raise RuntimeError(f"UI file not found: {html_path} (ensure templates/ui.html exists)")
    return HTMLResponse(html_path.read_text(encoding="utf-8"))
