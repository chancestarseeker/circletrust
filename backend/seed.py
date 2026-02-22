"""
Seed script: populates the CircleTrust database with demo data.

Run from backend/:
    python seed.py

Creates 6 seed members, connection edges, 1 pending invitation (DEMO1234),
and 2 sample help requests. Set DEMO_FIREBASE_UID in .env to link the first
member to your Firebase test account.
"""

import os
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "circletrust")
DEMO_FIREBASE_UID = os.getenv("DEMO_FIREBASE_UID", "demo-uid-placeholder")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Clear existing data
db.members.drop()
db.invitations.drop()
db.help_requests.drop()
print("Cleared existing collections.")

# Stable UUIDs for cross-references
maria_id = str(uuid.uuid4())
jorge_id = str(uuid.uuid4())
aisha_id = str(uuid.uuid4())
foodbank_id = str(uuid.uuid4())
clinic_id = str(uuid.uuid4())
garden_id = str(uuid.uuid4())

members = [
    {
        "id": maria_id,
        "firebase_uid": DEMO_FIREBASE_UID,
        "name": "Maria Santos",
        "tag": "community-organizer",
        "phone": "(804) 555-0001",
        "type": "individual",
        "connections": [jorge_id, aisha_id, foodbank_id, garden_id],
        "is_trusted": True,
        "invited_by": None,
        "is_dark": False,
        "public_fields": ["name", "tag", "type"],
    },
    {
        "id": jorge_id,
        "firebase_uid": None,
        "name": "Jorge Rivera",
        "tag": "youth-mentor",
        "phone": "(804) 555-0002",
        "type": "individual",
        "connections": [maria_id, clinic_id],
        "is_trusted": True,
        "invited_by": maria_id,
        "is_dark": False,
        "public_fields": ["name", "tag", "type"],
    },
    {
        "id": aisha_id,
        "firebase_uid": None,
        "name": "Aisha Johnson",
        "tag": "housing-advocate",
        "type": "individual",
        "connections": [maria_id, foodbank_id],
        "is_trusted": True,
        "invited_by": maria_id,
        "is_dark": False,
        "public_fields": ["name", "tag", "type"],
    },
    {
        "id": foodbank_id,
        "firebase_uid": None,
        "name": "Eastside Food Collective",
        "tag": "food-distribution",
        "phone": "(804) 555-0010",
        "address": "1200 E Main St, Richmond VA",
        "type": "organization",
        "connections": [maria_id, aisha_id],
        "is_trusted": True,
        "invited_by": maria_id,
        "is_dark": False,
        "public_fields": ["name", "tag", "type", "phone", "address"],
    },
    {
        "id": clinic_id,
        "firebase_uid": None,
        "name": "Neighborhood Health Clinic",
        "tag": "healthcare-provider",
        "phone": "(804) 555-0020",
        "address": "456 Oak Ave, Richmond VA",
        "type": "organization",
        "connections": [jorge_id],
        "is_trusted": True,
        "invited_by": jorge_id,
        "is_dark": False,
        "public_fields": ["name", "tag", "type", "phone", "address"],
    },
    {
        "id": garden_id,
        "firebase_uid": None,
        "name": "Community Garden Initiative",
        "tag": "urban-farming",
        "type": "project",
        "connections": [maria_id],
        "is_trusted": True,
        "invited_by": maria_id,
        "is_dark": False,
        "public_fields": ["name", "tag", "type"],
    },
]

db.members.insert_many(members)
print(f"Seeded {len(members)} members.")

# Pending invitation for live demo
db.invitations.insert_one({
    "code": "DEMO1234",
    "created_by": maria_id,
    "invitee_name": "New Community Member",
    "invitee_tag": "neighbor",
    "status": "pending",
    "accepted_by": None,
})
print("Created demo invitation code: DEMO1234")

# Sample help requests
db.help_requests.insert_many([
    {
        "id": str(uuid.uuid4()),
        "member_id": jorge_id,
        "member_name": "Jorge Rivera",
        "need": "Tutoring volunteers needed",
        "when_needed": "This week",
        "description": "Looking for 3 volunteers to help with after-school tutoring at Northside Community Center.",
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": str(uuid.uuid4()),
        "member_id": aisha_id,
        "member_name": "Aisha Johnson",
        "need": "Furniture for family moving into housing",
        "when_needed": "Next 2 weeks",
        "description": "Helping a family transition out of shelter — need bed, table, and chairs.",
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
])
print("Created 2 sample help requests.")

# Indexes
db.members.create_index("id", unique=True)
db.members.create_index("firebase_uid", sparse=True)
db.invitations.create_index("code", unique=True)
db.help_requests.create_index("member_id")
print("Indexes created.")

print(f"\nMaria Santos firebase_uid: {DEMO_FIREBASE_UID}")
print("Done! Run the backend with: uvicorn app.main:app --reload")
