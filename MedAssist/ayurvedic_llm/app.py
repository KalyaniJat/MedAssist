from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routes
# from routes import ask, remedies, ui
from .routes import ask, remedies, ui
# Import to trigger DB bootstrap side-effect
# from core import database  # noqa: F401

app = FastAPI(title="Ayurvedic LLM Assistant (Demo)")

# CORS (relaxed for demo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(ui.router)
app.include_router(remedies.router)
app.include_router(ask.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
