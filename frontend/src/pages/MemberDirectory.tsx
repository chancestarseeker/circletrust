import { useEffect, useState } from "react";
import client from "../api/client";
import type { Member } from "../types";

const TYPE_COLORS: Record<string, string> = {
  individual: "#4f46e5",
  organization: "#059669",
  project: "#d97706",
};

export default function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get<Member[]>("/members/")
      .then((res) => setMembers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(filter.toLowerCase()) ||
      m.tag.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <p>Loading directory...</p>;

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Member Directory
      </h1>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search by name or tag..."
        className="search-input"
        style={{ marginBottom: "1rem" }}
      />
      <p style={{ color: "#6b7280", marginBottom: "1rem", fontSize: "0.9rem" }}>
        {filtered.length} member{filtered.length !== 1 ? "s" : ""}
      </p>
      <div className="card-grid">
        {filtered.map((m) => (
          <div key={m.id} className="card">
            <div className="card-header">
              <span
                className="badge"
                style={{ background: TYPE_COLORS[m.type] || "#6b7280" }}
              >
                {m.type}
              </span>
              {m.is_dark && (
                <span
                  className="badge"
                  style={{ background: "#374151", marginLeft: "0.5rem" }}
                >
                  hidden
                </span>
              )}
            </div>
            <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{m.name}</h3>
            <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>{m.tag}</p>
            {m.phone && (
              <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                {m.phone}
              </p>
            )}
            {m.address && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  marginTop: "0.25rem",
                }}
              >
                {m.address}
              </p>
            )}
            <p
              style={{
                fontSize: "0.8rem",
                color: "#9ca3af",
                marginTop: "0.5rem",
              }}
            >
              {m.connections.length} connection
              {m.connections.length !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
