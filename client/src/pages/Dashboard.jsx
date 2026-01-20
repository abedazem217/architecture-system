import React, { useMemo } from "react";
import { Link } from "react-router-dom";

function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem("projects") || "[]");
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const projects = useMemo(() => loadProjects(), []);
  const total = projects.length;
  const active = projects.filter((p) => p.status === "Active").length;
  const onHold = projects.filter((p) => p.status === "On Hold").length;
  const completed = projects.filter((p) => p.status === "Completed").length;

  const card = {
    padding: 16,
    border: "1px solid #eee",
    borderRadius: 12,
    background: "#fff",
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "Arial" }}>
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <div style={card}>
          <div style={{ color: "#666" }}>Total Projects</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{total}</div>
        </div>
        <div style={card}>
          <div style={{ color: "#666" }}>Active</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{active}</div>
        </div>
        <div style={card}>
          <div style={{ color: "#666" }}>On Hold</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{onHold}</div>
        </div>
        <div style={card}>
          <div style={{ color: "#666" }}>Completed</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{completed}</div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/projects" style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, textDecoration: "none" }}>
          Manage Projects →
        </Link>
        <Link to="/documents" style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, textDecoration: "none" }}>
          Documents →
        </Link>
        <Link to="/meetings" style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, textDecoration: "none" }}>
          Meetings →
        </Link>
      </div>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #eee", borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>Today</h3>
        <div style={{ color: "#666" }}>
          This section can later show: upcoming meetings, latest documents, and recent activity.
        </div>
      </div>
    </div>
  );
}
