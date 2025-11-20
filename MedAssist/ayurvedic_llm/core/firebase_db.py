# ayurvedic_llm/core/firebase_db.py
import os
from pathlib import Path
from dotenv import load_dotenv

# Always load the .env that lives in the ayurvedic_llm/ package,
# even if the working directory is the project root.
PKG_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = PKG_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

import firebase_admin
from firebase_admin import credentials, firestore

_app = None
_db = None

def _resolve_credentials_path() -> Path:
    """
    Resolve GOOGLE_APPLICATION_CREDENTIALS from .env.
    If it's a relative path, interpret it relative to ayurvedic_llm/ (PKG_DIR).
    """
    raw = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "firebase-service-account.json").strip()
    p = Path(raw)
    return p if p.is_absolute() else (PKG_DIR / p)

def get_db():
    global _app, _db
    if _db:
        return _db

    cred_path = _resolve_credentials_path()
    if not cred_path.exists():
        raise RuntimeError(f"Service account file not found at {cred_path}")

    cred = credentials.Certificate(str(cred_path))
    # Initialize only once (idempotent)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    # Older firebase-admin versions don't support the `database=` kwarg; default DB is fine.
    _db = firestore.client()

    print(f"✅ Connected to Firestore (default database)  [creds: {cred_path.name}]")
    return _db
