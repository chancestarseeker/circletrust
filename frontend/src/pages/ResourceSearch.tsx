import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { ResourceResult } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CATEGORY_COLORS: Record<string, string> = {
  food: "#059669",
  housing: "#0284c7",
  healthcare: "#dc2626",
  mutual_aid: "#7c3aed",
  baby_supplies: "#d97706",
  clothing: "#0891b2",
  legal: "#4338ca",
  employment: "#15803d",
  transportation: "#9333ea",
};

function categoryLabel(cat: string) {
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ResourceSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResourceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [allResources, setAllResources] = useState<ResourceResult[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await axios.post(`${API_URL}/help/search`, { query });
      setResults(res.data.results);
      setHasSearched(true);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const loadAllResources = async () => {
    if (allResources.length > 0) {
      setShowAll(!showAll);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/resources/`);
      setAllResources(res.data);
      setShowAll(true);
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Community Resources
        </h1>
        <p style={{ color: "#6b7280", maxWidth: 500, margin: "0 auto" }}>
          Describe what you need help with and we'll connect you to
          Richmond-area resources.
        </p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='e.g. "I need diapers" or "Where can I find free food?"'
          className="search-input"
        />
        <button type="submit" disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {hasSearched && (
        <div style={{ marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
            {results.length} resource{results.length !== 1 ? "s" : ""} found
          </h2>
          <div className="card-grid">
            {results.map((r, i) => (
              <div key={i} className="card">
                <div className="card-header">
                  <span
                    className="badge"
                    style={{
                      background:
                        CATEGORY_COLORS[r.category] || "#6b7280",
                    }}
                  >
                    {categoryLabel(r.category)}
                  </span>
                </div>
                <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{r.name}</h3>
                <p style={{ color: "#374151", fontSize: "0.9rem" }}>
                  {r.description}
                </p>
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.85rem",
                    color: "#4f46e5",
                    wordBreak: "break-all",
                  }}
                >
                  {r.contact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          onClick={loadAllResources}
          style={{ background: "#6b7280" }}
        >
          {showAll ? "Hide All Resources" : "Browse All Resources"}
        </button>
      </div>

      {showAll && allResources.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
            All Community Resources
          </h2>
          <div className="card-grid">
            {allResources.map((r, i) => (
              <div key={i} className="card">
                <div className="card-header">
                  <span
                    className="badge"
                    style={{
                      background:
                        CATEGORY_COLORS[r.category] || "#6b7280",
                    }}
                  >
                    {categoryLabel(r.category)}
                  </span>
                </div>
                <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{r.name}</h3>
                <p style={{ color: "#374151", fontSize: "0.9rem" }}>
                  {r.description}
                </p>
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.85rem",
                    color: "#4f46e5",
                    wordBreak: "break-all",
                  }}
                >
                  {r.contact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: "2rem",
          textAlign: "center",
          padding: "1.5rem",
          background: "#eef2ff",
          borderRadius: "8px",
        }}
      >
        <p style={{ color: "#374151", marginBottom: "0.5rem" }}>
          Have an invitation code?
        </p>
        <Link to="/accept-invitation">
          <button>Join the Circle of Trust</button>
        </Link>
      </div>
    </div>
  );
}
