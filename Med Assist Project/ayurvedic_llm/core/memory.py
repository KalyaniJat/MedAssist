# ayurvedic_llm/core/memory.py
from __future__ import annotations
from typing import List, Dict, Any
from datetime import datetime, timezone

from google.cloud.firestore_v1 import FieldFilter
from .firebase_db import get_db
from .config import model


def get_recent_history(user_id: int | str, limit: int = 8) -> List[Dict[str, Any]]:
    """
    Return last N messages (chronological) for a user from Firestore.
    NOTE: With limit_to_last() you must call .get() (not .stream()).
    """
    db = get_db()
    q = (
        db.collection("conversations")
        .where(filter=FieldFilter("user_id", "==", user_id))
        .order_by("created_at")
        .limit_to_last(limit)
    )
    docs = q.get()  # IMPORTANT: .get(), not .stream()

    history: List[Dict[str, Any]] = []
    for doc in docs:
        data = doc.to_dict() or {}
        history.append({"role": data.get("role"), "text": data.get("text", "")})
    return history  # already in ascending created_at order


def get_memory_summary(user_id: int | str) -> str:
    """
    Read rolling long-term memory summary for a user.
    Stored at users/{id}/memory/summary { text, updated_at, turns }
    """
    db = get_db()
    ref = (
        db.collection("users")
        .document(str(user_id))
        .collection("memory")
        .document("summary")
    )
    snap = ref.get()
    if snap.exists:
        data = snap.to_dict() or {}
        return data.get("text", "") or ""
    return ""


def _write_memory_summary(user_id: int | str, text: str, turns: int) -> None:
    db = get_db()
    (
        db.collection("users")
        .document(str(user_id))
        .collection("memory")
        .document("summary")
        .set(
            {
                "text": text,
                "turns": int(turns),
                "updated_at": datetime.now(timezone.utc),
            }
        )
    )


def update_memory_summary(
    user_id: int | str,
    old_summary: str,
    last_exchange: Dict[str, str],
    turns: int,
) -> str:
    """
    Use the LLM to update a compact long-term memory summary.
    Keep stable facts (allergies, chronic conditions, preferences) and recurring issues.
    Keep under ~1200 chars.
    """
    prompt = f"""
You are a summarization helper. Update the user's long-term health memory.
- Keep stable facts: allergies, chronic conditions, medications, durable preferences.
- Keep recurring problems and durable advice.
- Remove transient one-off symptoms unless recurrent.
- Output a single paragraph under 1200 characters.

CURRENT SUMMARY:
{old_summary or "(none)"}

LAST EXCHANGE:
User: {last_exchange.get("user","")}
Assistant: {last_exchange.get("assistant","")}
"""
    resp = model.generate_content(prompt)
    new_summary = (getattr(resp, "text", "") or "").strip()
    if new_summary:
        _write_memory_summary(user_id, new_summary, turns)
        return new_summary
    return old_summary
