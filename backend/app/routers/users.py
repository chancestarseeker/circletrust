"""
Example CRUD router for user profiles.

All endpoints require a valid Firebase ID token (via `get_current_user`).
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth import get_current_user
from app.database import get_database
from app.models.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    body: UserCreate,
    current_user: dict = Depends(get_current_user),
):
    """Create a user profile linked to the authenticated Firebase UID."""
    db = get_database()
    uid = current_user["uid"]

    # Prevent duplicate profiles
    if db.users.find_one({"uid": uid}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Profile already exists for this user.",
        )

    doc = {
        "uid": uid,
        "email": body.email,
        "display_name": body.display_name,
    }
    result = db.users.insert_one(doc)

    return UserResponse(
        id=str(result.inserted_id),
        uid=uid,
        email=body.email,
        display_name=body.display_name,
    )


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    db = get_database()
    doc = db.users.find_one({"uid": current_user["uid"]})

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Create one first via POST /users/.",
        )

    return UserResponse(
        id=str(doc["_id"]),
        uid=doc["uid"],
        email=doc["email"],
        display_name=doc["display_name"],
    )
