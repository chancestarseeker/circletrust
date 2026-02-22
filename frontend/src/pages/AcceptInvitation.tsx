import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useMember } from "../contexts/MemberContext";

export default function AcceptInvitation() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    member_name: string;
    invited_by: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isTrusted, refetch } = useMember();

  if (isTrusted) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h1 style={{ fontSize: "1.5rem" }}>You're already in the Circle</h1>
        <p style={{ color: "#6b7280", margin: "1rem 0" }}>
          You're a trusted member of CircleTrust.
        </p>
        <Link to="/graph">
          <button>View Trust Graph</button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await client.post("/invitations/accept", { code: code.trim() });
      setSuccess(res.data);
      refetch();
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to accept invitation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h1 style={{ fontSize: "1.75rem", color: "#059669" }}>
          Welcome to the Circle of Trust
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            margin: "1rem 0",
            color: "#374151",
          }}
        >
          <strong>{success.member_name}</strong>, you were invited by{" "}
          <strong>{success.invited_by}</strong>.
        </p>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
          Your trust connection is now visible in the network graph.
        </p>
        <button onClick={() => navigate("/graph")}>
          View Trust Graph
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "3rem auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        Accept Invitation
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        Enter the invitation code you received from a CircleTrust member.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code (e.g. DEMO1234)"
          className="search-input"
          style={{
            textAlign: "center",
            fontSize: "1.25rem",
            letterSpacing: "0.1em",
            fontFamily: "monospace",
          }}
        />
        {error && (
          <p style={{ color: "#dc2626", marginTop: "0.5rem" }}>{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          style={{ marginTop: "1rem", width: "100%" }}
        >
          {submitting ? "Joining..." : "Join the Circle"}
        </button>
      </form>
    </div>
  );
}
