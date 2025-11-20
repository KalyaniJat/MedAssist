# ayurvedic_llm/routes/ask.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, validator
from datetime import datetime, timezone
from typing import Optional, Union

from ..core.firebase_db import get_db
from ..core.utils import call_gemini_with_context, fetch_user_bundle
from ..core.memory import update_memory_summary

router = APIRouter()

class AskIn(BaseModel):
    # Accept either a string uid (preferred) or an integer id,
    # convert to string internally via validator.
    user_id: Optional[Union[str, int]] = None
    question: str

    @validator("user_id", pre=True)
    def coerce_user_id_to_str(cls, v):
        # allow None
        if v is None:
            return v
        # If it's already a string, keep it; if it's numeric, turn it into a string
        return str(v)

@router.post("/ask")
def ask(in_: AskIn):
    """
    Public endpoint (no Authorization required).
    - Accepts user_id as str or int and coerces to string.
    - If user_id is omitted, uses fallback 'dev-user-1'.
    """
    uid = in_.user_id or "dev-user-1"
    # uid is guaranteed to be a str here because of the validator
    if not isinstance(uid, str):
        uid = str(uid)

    question = (in_.question or "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="Empty question")

    # Log user question to Firestore (best-effort)
    try:
        db = get_db()
        db.collection("conversations").add({
            "user_id": uid,
            "role": "user",
            "text": question,
            "created_at": datetime.now(timezone.utc),
        })
    except Exception:
        import logging
        logging.exception("Failed to write user question to Firestore")

    # Load user bundle/profile
    user_bundle = fetch_user_bundle(uid)

    # Call LLM with context/memory
    answer_text, history, old_summary = call_gemini_with_context(user_bundle, question, uid)

    # Log assistant answer
    try:
        db.collection("conversations").add({
            "user_id": uid,
            "role": "assistant",
            "text": answer_text,
            "created_at": datetime.now(timezone.utc),
        })
    except Exception:
        import logging
        logging.exception("Failed to write assistant answer to Firestore")

    # Update rolling memory summary (non-blocking)
    try:
        last_exchange = {"user": question, "assistant": answer_text}
        turns = (len(history) // 2) + 1
        _ = update_memory_summary(uid, old_summary, last_exchange, turns)
    except Exception:
        import logging
        logging.exception("Failed to update memory summary")

    return {
        "user_id": uid,
        "answer_text": answer_text,
        "disclaimer": "Educational use only. Not a replacement for professional care.",
    }
