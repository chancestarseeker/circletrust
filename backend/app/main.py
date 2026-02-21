"""
FastAPI application entry-point.

Run with:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import users

app = FastAPI(
    title="CircleTrust API",
    version="0.1.0",
)

# CORS – allow the frontend origin(s) defined in .env
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users.router)


@app.get("/")
def root():
    """Health-check / landing route."""
    return {"status": "ok", "app": "CircleTrust API"}
