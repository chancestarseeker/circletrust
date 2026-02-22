"""
Member endpoints for the trust network.
GET /members/me requires auth (but not trust).
All other endpoints require trusted member status.
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth import get_current_user
from app.database import get_database
from app.models.member import MemberResponse

router = APIRouter(prefix="/members", tags=["members"])


def _get_trusted_member(current_user: dict = Depends(get_current_user)):
    """Dependency: resolve Firebase user to trusted member or 403."""
    db = get_database()
    member = db.members.find_one({
        "firebase_uid": current_user["uid"],
        "is_trusted": True,
    })
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be a trusted member to access this resource.",
        )
    return member


def _to_response(m: dict) -> MemberResponse:
    return MemberResponse(
        id=m["id"],
        name=m["name"],
        tag=m["tag"],
        phone=m.get("phone"),
        address=m.get("address"),
        type=m.get("type", "individual"),
        connections=m.get("connections", []),
        is_trusted=m.get("is_trusted", False),
        invited_by=m.get("invited_by"),
        is_dark=m.get("is_dark", False),
        public_fields=m.get("public_fields", []),
    )


@router.get("/me", response_model=MemberResponse)
def get_my_member(current_user: dict = Depends(get_current_user)):
    """Return the member record for the authenticated user (auth required, trust not required)."""
    db = get_database()
    m = db.members.find_one({"firebase_uid": current_user["uid"]})
    if not m:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No member record found.",
        )
    return _to_response(m)


@router.get("/graph")
def get_trust_graph(member=Depends(_get_trusted_member)):
    """Return the full trust graph as {nodes, edges}."""
    db = get_database()
    all_members = list(db.members.find({}))

    nodes = []
    for m in all_members:
        node = {
            "id": m["id"],
            "name": m["name"],
            "tag": m["tag"],
            "type": m.get("type", "individual"),
            "is_trusted": m.get("is_trusted", False),
        }
        if m.get("is_dark"):
            node["name"] = "Hidden Member"
            node["tag"] = ""
        nodes.append(node)

    edges = []
    seen = set()
    for m in all_members:
        for conn_id in m.get("connections", []):
            edge_key = tuple(sorted([m["id"], conn_id]))
            if edge_key not in seen:
                seen.add(edge_key)
                edges.append({"source": m["id"], "target": conn_id})

    return {"nodes": nodes, "edges": edges}


@router.get("/", response_model=list[MemberResponse])
def list_members(member=Depends(_get_trusted_member)):
    """Return all members (trusted member directory)."""
    db = get_database()
    members = list(db.members.find({}))
    return [_to_response(m) for m in members]


@router.get("/{member_id}", response_model=MemberResponse)
def get_member(member_id: str, member=Depends(_get_trusted_member)):
    """Return a single member by ID."""
    db = get_database()
    m = db.members.find_one({"id": member_id})
    if not m:
        raise HTTPException(status_code=404, detail="Member not found")
    return _to_response(m)
