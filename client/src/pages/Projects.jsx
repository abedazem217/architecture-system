import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "projects";

function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [status, setStatus] = useState("Planning");

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const canAdd = useMemo(() => title.trim() && clientName.trim(), [title, clientName]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!canAdd) return;

    const newProject = {
      id: Date.now().toString(),
      title: title.trim(),
      clientName: clientName.trim(),
      status,
      createdAt: new Date().toISOString(),
    };

    const next = [newProject, ...projects];
    setProjects(next);
    saveProjects(next);

    setTitle("");
    setClientName("");
    setStatus("Planning");
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "Arial", padding: 12 }}>
      <h2>Projects</h2>

      <form onSubmit={handleAdd} style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <h3>Add Project</h3>

        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          <input
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Client name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Planning">Planning</option>
            <option value="Design">Design</option>
            <option value="Licensing">Licensing</option>
            <option value="Execution">Execution</option>
            <option value="Done">Done</option>
          </select>

          <button type="submit" disabled={!canAdd}>
            Add
          </button>
        </div>
      </form>

      <div style={{ marginTop: 20 }}>
        {projects.length === 0 ? (
          <p>No projects yet. Add your first project.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {projects.map((p) => (
              <div key={p.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{p.title}</div>
                    <div style={{ fontSize: 14 }}>Client: {p.clientName}</div>
                    <div style={{ fontSize: 14 }}>Status: {p.status}</div>
                  </div>
                  <div style={{ alignSelf: "center" }}>
                    <Link to={`/projects/${p.id}`}>Open</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
