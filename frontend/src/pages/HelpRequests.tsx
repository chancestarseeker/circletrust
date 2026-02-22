import { useEffect, useState } from "react";
import client from "../api/client";
import type { HelpRequest } from "../types";

const WHEN_OPTIONS = ["ASAP", "This week", "Next 2 weeks", "This month", "Flexible"];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const URGENCY_COLORS: Record<string, string> = {
  ASAP: "#dc2626",
  "This week": "#d97706",
  "Next 2 weeks": "#0284c7",
  "This month": "#059669",
  Flexible: "#6b7280",
};

export default function HelpRequests() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [need, setNeed] = useState("");
  const [whenNeeded, setWhenNeeded] = useState("This week");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = () => {
    client
      .get<HelpRequest[]>("/help/requests")
      .then((res) => setRequests(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!need.trim()) return;
    setSubmitting(true);
    try {
      await client.post("/help/requests", {
        need,
        when_needed: whenNeeded,
        description: description || undefined,
      });
      setNeed("");
      setDescription("");
      setWhenNeeded("This week");
      fetchRequests();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Help Board</h1>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
          New Request
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">What do you need?</label>
            <input
              type="text"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              placeholder="e.g. Tutoring volunteers, furniture donations"
              className="search-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">When is it needed?</label>
            <select
              value={whenNeeded}
              onChange={(e) => setWhenNeeded(e.target.value)}
              className="search-input"
            >
              {WHEN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Description <span style={{ color: "#9ca3af" }}>(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about your request..."
              className="search-input"
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post Request"}
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No requests yet.</p>
      ) : (
        <div className="card-grid">
          {requests.map((r) => (
            <div key={r.id} className="card">
              <div className="card-header">
                <span
                  className="badge"
                  style={{
                    background: URGENCY_COLORS[r.when_needed] || "#6b7280",
                  }}
                >
                  {r.when_needed}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                    marginLeft: "auto",
                  }}
                >
                  {timeAgo(r.created_at)}
                </span>
              </div>
              <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{r.need}</h3>
              <p style={{ fontSize: "0.85rem", color: "#4f46e5" }}>
                {r.member_name}
              </p>
              {r.description && (
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#374151",
                    marginTop: "0.5rem",
                  }}
                >
                  {r.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
