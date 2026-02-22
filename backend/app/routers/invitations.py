"""
Invitation endpoints — the trust event mechanism.
POST /invitations/ — create invitation (trusted member only)
POST /invitations/accept — accept invitation (authenticated, not yet trusted)
GET /invitations/ — list own invitations (trusted only)
"""

import secrets
import uuid

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth import get_current_user
from app.database import get_database
from app.models.invitation import (
    InvitationAccept,
    InvitationCreate,
    InvitationResponse,
    InvitationStatus,
)

router = APIRouter(prefix="/invitations", tags=["invitations"])


def _get_trusted_member(current_user: dict = Depends(get_current_user)):
    db = get_database()
    member = db.members.find_one({
        "firebase_uid": current_user["uid"],
        "is_trusted": True,
    })
    if not member:
        raise HTTPException(status_code=403, detail="Trusted member access required.")
    return member


@router.post("/", response_model=InvitationResponse, status_code=201)
def create_invitation(body: InvitationCreate, member=Depends(_get_trusted_member)):
    """Create an invitation code (trusted members only)."""
    db = get_database()
    code = secrets.token_hex(4).upper()

    doc = {
        "code": code,
        "created_by": member["id"],
        "invitee_name": body.invitee_name,
        "invitee_tag": body.invitee_tag,
        "status": InvitationStatus.pending.value,
        "accepted_by": None,
    }
    db.invitations.insert_one(doc)

    return InvitationResponse(**{k: v for k, v in doc.items() if k != "_id"})


@router.post("/accept")
def accept_invitation(
    body: InvitationAccept,
    current_user: dict = Depends(get_current_user),
):
    """Accept an invitation code — the trust event."""
    db = get_database()

    # Check if user is already a trusted member
    existing = db.members.find_one({"firebase_uid": current_user["uid"]})
    if existing and existing.get("is_trusted"):
        raise HTTPException(status_code=409, detail="You are already a trusted member.")

    invitation = db.invitations.find_one({"code": body.code})
    if not invitation:
        raise HTTPException(status_code=404, detail="Invalid invitation code.")
    if invitation["status"] != "pending":
        raise HTTPException(
            status_code=400,
            detail=f"Invitation is already {invitation['status']}.",
        )

    inviter = db.members.find_one({"id": invitation["created_by"]})
    if not inviter:
        raise HTTPException(status_code=500, detail="Inviter member not found.")

    # Create new trusted member
    new_member_id = str(uuid.uuid4())
    new_member = {
        "id": new_member_id,
        "firebase_uid": current_user["uid"],
        "name": invitation["invitee_name"],
        "tag": invitation["invitee_tag"],
        "type": "individual",
        "connections": [inviter["id"]],
        "is_trusted": True,
        "invited_by": inviter["id"],
        "is_dark": False,
        "public_fields": ["name", "tag", "type"],
    }
    db.members.insert_one(new_member)

    # Add bidirectional connection
    db.members.update_one(
        {"id": inviter["id"]},
        {"$addToSet": {"connections": new_member_id}},
    )

    # Mark invitation as accepted
    db.invitations.update_one(
        {"code": body.code},
        {"$set": {"status": "accepted", "accepted_by": new_member_id}},
    )

    return {
        "message": "Welcome to the circle of trust.",
        "member_id": new_member_id,
        "member_name": invitation["invitee_name"],
        "invited_by": inviter["name"],
    }


@router.get("/", response_model=list[InvitationResponse])
def list_my_invitations(member=Depends(_get_trusted_member)):
    """List invitations created by the current trusted member."""
    db = get_database()
    invitations = list(db.invitations.find({"created_by": member["id"]}))
    return [
        InvitationResponse(**{k: v for k, v in inv.items() if k != "_id"})
        for inv in invitations
    ]
