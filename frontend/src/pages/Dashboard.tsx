import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useMember } from "../contexts/MemberContext";
import client from "../api/client";
import type { HelpRequest } from "../types";

export default function Dashboard() {
  const { member } = useMember();
  const [recentRequests, setRecentRequests] = useState<HelpRequest[]>([]);

  useEffect(() => {
    client
      .get<HelpRequest[]>("/help/requests")
      .then((res) => setRecentRequests(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem" }}>
          Welcome, {member?.name || "Member"}
        </h1>
        <button onClick={() => signOut(auth)}>Sign out</button>
      </header>

      <p style={{ color: "#6b7280", margin: "0.5rem 0 1.5rem" }}>
        {member?.tag} &middot; {member?.connections.length || 0} connections
      </p>

      <div className="card-grid">
        <Link to="/graph" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {/* network icon via unicode */}
              &#x1F310;
            </div>
            <h3>Trust Graph</h3>
            <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              View the network
            </p>
          </div>
        </Link>
        <Link to="/members" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              &#x1F465;
            </div>
            <h3>Members</h3>
            <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              Browse directory
            </p>
          </div>
        </Link>
        <Link to="/help" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              &#x1F91D;
            </div>
            <h3>Help Board</h3>
            <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              Requests &amp; offers
            </p>
          </div>
        </Link>
        <Link to="/invite" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              &#x1F517;
            </div>
            <h3>Invite</h3>
            <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              Extend the circle
            </p>
          </div>
        </Link>
      </div>

      {recentRequests.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
            Recent Help Requests
          </h2>
          {recentRequests.map((r) => (
            <div
              key={r.id}
              style={{
                padding: "0.75rem 1rem",
                background: "#fff",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                marginBottom: "0.5rem",
              }}
            >
              <strong>{r.need}</strong>
              <span style={{ color: "#6b7280", marginLeft: "0.5rem", fontSize: "0.85rem" }}>
                — {r.member_name} ({r.when_needed})
              </span>
            </div>
          ))}
          <Link to="/help" style={{ color: "#4f46e5", fontSize: "0.9rem" }}>
            View all requests
          </Link>
        </div>
      )}
    </div>
  );
}
