"""
PyMongo database handle.

Provides a module-level `get_database()` helper that returns the default
database.  Import it wherever you need DB access:

    from app.database import get_database
    db = get_database()
    db["users"].find_one({"email": "a@b.com"})
"""

from pymongo import MongoClient
from pymongo.database import Database

from app.config import settings

_client: MongoClient | None = None


def _get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(settings.mongo_uri)
    return _client


def get_database() -> Database:
    """Return the PyMongo Database handle for the configured DB_NAME."""
    return _get_client()[settings.db_name]
