from __future__ import annotations
from typing import Dict, Any, List
from .config import model
from .firebase_db import get_db
from ..models.schemas import Remedy  # <- keep your relative import
from .memory import get_recent_history, get_memory_summary, update_memory_summary

SYSTEM_RULES = (
    "You are an Ayurvedic medical assistant. Give clear, safe, stepwise guidance. "
    "ALWAYS include safety disclaimers and contraindications. If risky -> advise clinician visit. "
)

def fetch_user_bundle(user_id: int | str) -> dict:
    """
    Load user's saved profile from Firestore.
    Expected fields (if present): allergies [list], conditions [list], medications [list], profile {map}
    """
    db = get_db()
    snap = db.collection("users").document(str(user_id)).get()
    data = snap.to_dict() if snap.exists else {}
    return {
        "allergies": data.get("allergies", []) or [],
        "conditions": data.get("conditions", []) or [],
        "medications": data.get("medications", []) or [],
        "profile": data.get("profile", {}) or {},
    }

def apply_allergy_filter(text: str, allergies: list[str] | None = None) -> str:
    """
    Placeholder safety filter. For now, it returns text unchanged.
    You can expand this to remove herbs that match user's allergies.
    """
    return text

# OPTIONAL: keep a JSON-builder shim if any route still calls it
def build_prompt(user_bundle: Dict[str, Any], memory_summary: str, history: List[Dict[str,str]], question: str) -> str:

    allergies = ", ".join(user_bundle.get("allergies", []) or []) or "none noted"
    conditions = ", ".join(user_bundle.get("conditions", []) or []) or "none noted"
    meds = ", ".join(user_bundle.get("medications", []) or []) or "none noted"

    history_text = ""
    for turn in history:
        role = "User" if turn["role"] == "user" else "Assistant"
        history_text += f"{role}: {turn['text']}\n"

    return f"""
{SYSTEM_RULES}

USER PROFILE:
- Allergies: {allergies}
- Conditions: {conditions}
- Medications: {meds}

LONG-TERM MEMORY (condensed):
{memory_summary or "(empty)"}

RECENT DIALOG (most recent last):
{history_text or "(no recent messages)"}

NEW QUESTION:
{question}

INSTRUCTIONS:
- Consider allergies/conditions/medications before suggesting remedies.
- Provide a concise plan with bullet points (diet, lifestyle, herbs), explain rationale.
- Call out RED FLAGS and when to see a clinician.
- Return plain text; avoid markdown tables unless necessary.
"""

def build_prompt(user_bundle: Dict[str, Any], memory_summary: str, history: List[Dict[str,str]], question: str) -> str:
    profile = user_bundle or {}
    allergies = ", ".join(profile.get("allergies", []) or []) or "none noted"
    conditions = ", ".join(profile.get("conditions", []) or []) or "none noted"
    meds = ", ".join(profile.get("medications", []) or []) or "none noted"

    history_text = ""
    for turn in history:
        role = "User" if turn["role"] == "user" else "Assistant"
        history_text += f"{role}: {turn['text']}\n"

    return f"""
{SYSTEM_RULES}

USER PROFILE:
- Allergies: {allergies}
- Conditions: {conditions}
- Medications: {meds}

LONG-TERM MEMORY (condensed):
{memory_summary or "(empty)"}

RECENT DIALOG (most recent last):
{history_text or "(no recent messages)"}

NEW QUESTION:
{question}

INSTRUCTIONS:
- Consider allergies/conditions/medications before suggesting remedies.
- Provide a concise plan with bullet points (diet, lifestyle, herbs), explain rationale.
- Call out RED FLAGS and when to see a clinician.
- Return plain text; avoid markdown tables unless necessary.
"""

def call_gemini_with_context(user_bundle: Dict[str,Any], question: str, user_id: int | str):
    history = get_recent_history(user_id, limit=8)
    memory_summary = get_memory_summary(user_id)
    prompt = build_prompt(user_bundle, memory_summary, history, question)
    resp = model.generate_content(prompt)
    answer = (getattr(resp, "text", "") or "").strip()
    return answer, history, memory_summary

# Backward-compat shim if any old code calls it:
def build_prompt_json(*args, **kwargs):
    return {}
