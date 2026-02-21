"""
Example Pydantic models for User documents.

These are used for request validation and response serialisation in the
users router.  Extend or replace them as the schema evolves.
"""

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Payload for creating a new user profile."""
    email: EmailStr
    display_name: str = Field(..., min_length=1, max_length=100)


class UserResponse(BaseModel):
    """Public representation of a user returned by the API."""
    id: str
    uid: str
    email: str
    display_name: str
