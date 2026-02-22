"""Pydantic models for Member documents in the trust network."""

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class MemberType(str, Enum):
    individual = "individual"
    organization = "organization"
    project = "project"


class MemberCreate(BaseModel):
    """Payload for creating a new member profile."""
    name: str = Field(..., min_length=1, max_length=200)
    tag: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = None
    address: Optional[str] = None
    type: MemberType = MemberType.individual


class MemberResponse(BaseModel):
    """Full member representation (post-trust views)."""
    id: str
    name: str
    tag: str
    phone: Optional[str] = None
    address: Optional[str] = None
    type: MemberType
    connections: list[str] = []
    is_trusted: bool
    invited_by: Optional[str] = None
    is_dark: bool = False
    public_fields: list[str] = []


class MemberPublicResponse(BaseModel):
    """Restricted member view for pre-trust / public contexts."""
    id: str
    name: str
    tag: str
    type: MemberType
