import { useEffect, useState } from "react";
import client from "../api/client";
import type { Invitation } from "../types";

export default function CreateInvitation() {
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [copied, setCopied] = useState(false);

  const fetchInvitations = () => {
    client
      .get<Invitation[]>("/invitations/")
      .then((res) => setInvitations(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tag.trim()) return;
    setSubmitting(true);
    try {
      const res = await client.post("/invitations/", {
        invitee_name: name,
        invitee_tag: tag,
      });
      setCreatedCode(res.data.code);
      setName("");
      setTag("");
      fetchInvitations();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = async () => {
    if (createdCode) {
      await navigator.clipboard.writeText(createdCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Invite to CircleTrust
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        Create an invitation code for someone you've met in person and trust.
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Their name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. David Kim"
              className="search-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Their tag / role</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. neighbor, volunteer, organizer"
              className="search-input"
            />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Invitation"}
          </button>
        </form>
      </div>

      {createdCode && (
        <div
          style={{
            textAlign: "center",
            padding: "1.5rem",
            background: "#ecfdf5",
            borderRadius: "8px",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ color: "#059669", marginBottom: "0.5rem" }}>
            Invitation created! Share this code:
          </p>
          <div
            style={{
              fontSize: "2rem",
              fontFamily: "monospace",
              fontWeight: "bold",
              letterSpacing: "0.15em",
              color: "#1f2937",
              marginBottom: "0.75rem",
            }}
          >
            {createdCode}
          </div>
          <button onClick={copyCode} style={{ background: "#059669" }}>
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      )}

      {invitations.length > 0 && (
        <div>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
            Your Invitations
          </h2>
          <div className="card-grid">
            {invitations.map((inv) => (
              <div key={inv.code} className="card">
                <div className="card-header">
                  <span
                    className="badge"
                    style={{
                      background:
                        inv.status === "accepted"
                          ? "#059669"
                          : inv.status === "pending"
                          ? "#d97706"
                          : "#dc2626",
                    }}
                  >
                    {inv.status}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                      marginLeft: "auto",
                    }}
                  >
                    {inv.code}
                  </span>
                </div>
                <h3 style={{ margin: "0.5rem 0 0.25rem" }}>
                  {inv.invitee_name}
                </h3>
                <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                  {inv.invitee_tag}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
