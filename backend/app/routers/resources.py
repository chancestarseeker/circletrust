"""
Public resource search endpoints — pre-trust layer.
No authentication required.
"""

from fastapi import APIRouter, Query

from app.resources import RESOURCES, match_resources

router = APIRouter(prefix="/resources", tags=["resources"])


@router.get("/")
def list_resources():
    """Return all community resources (public directory)."""
    return [
        {
            "name": r.name,
            "category": r.category,
            "description": r.description,
            "contact": r.contact,
        }
        for r in RESOURCES
    ]


@router.get("/categories")
def list_categories():
    """Return distinct resource categories."""
    return sorted(set(r.category for r in RESOURCES))


@router.get("/search")
def search_resources(q: str = Query(..., min_length=1, max_length=500)):
    """Search community resources with a freeform query."""
    return {"query": q, "results": match_resources(q)}
