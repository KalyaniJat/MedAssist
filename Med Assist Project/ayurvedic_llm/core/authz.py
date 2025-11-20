# ayurvedic_llm/core/authz.py
from fastapi import Request, HTTPException, status
import firebase_admin
from firebase_admin import auth, credentials
import os
from typing import Dict, Any

# Initialize Firebase app if not already initialised.
# Prefer GOOGLE_APPLICATION_CREDENTIALS env var pointing to a service account JSON.
if not firebase_admin._apps:
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    try:
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # Try default app initialization (works on GCP or if ADC is configured)
            firebase_admin.initialize_app()
    except Exception:
        # If initialization fails, we still continue — verification will error clearly.
        pass


async def get_current_user(request: Request) -> Dict[str, Any]:
    """
    FastAPI dependency to verify Firebase ID token passed in the
    Authorization: Bearer <id_token> header.

    Returns the decoded token (a dict with uid, email, etc.) on success.
    Raises HTTPException(401) on failure.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    id_token = auth_header.split(" ", 1)[1].strip()
    if not id_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Empty token")

    try:
        decoded_token = auth.verify_id_token(id_token)
        # decoded_token contains fields like 'uid', 'email', 'aud', etc.
        return decoded_token
    except firebase_admin.exceptions.FirebaseError as fe:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Firebase error: {fe}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
