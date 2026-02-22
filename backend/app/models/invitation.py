"""Pydantic models for Invitation documents (trust events)."""

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class InvitationStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    revoked = "revoked"


class InvitationCreate(BaseModel):
    """Payload for creating an invitation (trusted member only)."""
    invitee_name: str = Field(..., min_length=1, max_length=200)
    invitee_tag: str = Field(..., min_length=1, max_length=100)


class InvitationResponse(BaseModel):
    """Invitation as returned by the API."""
    code: str
    created_by: str
    invitee_name: str
    invitee_tag: str
    status: InvitationStatus
    accepted_by: Optional[str] = None


class InvitationAccept(BaseModel):
    """Payload for accepting an invitation."""
    code: str
