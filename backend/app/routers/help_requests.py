"""
Help request endpoints — dual-layer.
POST /help/search — public pre-trust resource search (NO auth)
POST /help/requests — structured post-trust request (trusted only)
GET /help/requests — list post-trust requests (trusted only)
"""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.database import get_database
from app.models.help_request import (
    PosttrustHelpRequestCreate,
    PosttrustHelpRequestResponse,
    PretrustHelpRequest,
)
from app.resources import match_resources

router = APIRouter(prefix="/help", tags=["help"])


def _get_trusted_member(current_user: dict = Depends(get_current_user)):
    db = get_database()
    member = db.members.find_one({
        "firebase_uid": current_user["uid"],
        "is_trusted": True,
    })
    if not member:
        raise HTTPException(status_code=403, detail="Trusted member access required.")
    return member


@router.post("/search")
def pretrust_search(body: PretrustHelpRequest):
    """Public: match a freeform help query to community resources. No auth required."""
    results = match_resources(body.query)
    return {"query": body.query, "results": results}


@router.post(
    "/requests",
    response_model=PosttrustHelpRequestResponse,
    status_code=201,
)
def create_help_request(
    body: PosttrustHelpRequestCreate,
    member=Depends(_get_trusted_member),
):
    """Create a structured help request (trusted members only)."""
    db = get_database()
    doc = {
        "id": str(uuid.uuid4()),
        "member_id": member["id"],
        "member_name": member["name"],
        "need": body.need,
        "when_needed": body.when_needed,
        "description": body.description,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    db.help_requests.insert_one(doc)
    return PosttrustHelpRequestResponse(**{k: v for k, v in doc.items() if k != "_id"})


@router.get("/requests", response_model=list[PosttrustHelpRequestResponse])
def list_help_requests(member=Depends(_get_trusted_member)):
    """List all help requests from trusted members."""
    db = get_database()
    requests = list(db.help_requests.find({}).sort("created_at", -1))
    return [
        PosttrustHelpRequestResponse(**{k: v for k, v in r.items() if k != "_id"})
        for r in requests
    ]
