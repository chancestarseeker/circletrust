"""
Firebase Authentication dependency for FastAPI.

Initialises the Firebase Admin SDK on first import, then exposes
`get_current_user` as a FastAPI dependency that verifies the
Authorization: Bearer <id-token> header.

Usage in a router:

    from app.auth import get_current_user

    @router.get("/me")
    def me(user: dict = Depends(get_current_user)):
        return user
"""

import os

import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

# Initialise Firebase Admin SDK once
_cred_path = settings.firebase_credentials_path
if os.path.exists(_cred_path):
    _cred = credentials.Certificate(_cred_path)
    firebase_admin.initialize_app(_cred)
else:
    # Allow the server to start without credentials (for local dev);
    # token verification will fail at request time.
    firebase_admin.initialize_app()

_bearer_scheme = HTTPBearer()


def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
) -> dict:
    """Verify a Firebase ID token and return the decoded claims."""
    token = creds.credentials
    try:
        decoded = auth.verify_id_token(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
        ) from exc
    return decoded
