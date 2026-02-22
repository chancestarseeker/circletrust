"""Pydantic models for HelpRequest documents (pre-trust and post-trust)."""

from typing import Optional

from pydantic import BaseModel, Field


class PretrustHelpRequest(BaseModel):
    """Freeform help query from anyone (no auth needed)."""
    query: str = Field(..., min_length=3, max_length=500)


class PosttrustHelpRequestCreate(BaseModel):
    """Structured help request from a trusted member."""
    need: str = Field(..., min_length=1, max_length=200)
    when_needed: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)


class PosttrustHelpRequestResponse(BaseModel):
    """A post-trust help request as seen by trusted members."""
    id: str
    member_id: str
    member_name: str
    need: str
    when_needed: str
    description: Optional[str] = None
    created_at: str
