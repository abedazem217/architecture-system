import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const STORAGE_KEY = "projects";

function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const all = loadProjects();
    const found = all.find((p) => p.id === id);
    setProject(found || null);
  }, [id]);

  const updateStatus = (newStatus) => {
    const all = loadProjects();
    const next = all.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
    saveProjects(next);
    setProject(next.find((p) => p.id === id) || null);
  };

  const handleDelete = () => {
    const all = loadProjects();
    const next = all.filter((p) => p.id !== id);
    saveProjects(next);
    navigate("/projects");
  };

  if (!project) {
    return (
      <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "Arial", padding: 12 }}>
        <h2>Project not found</h2>
        <Link to="/projects">Back</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "Arial", padding: 12 }}>
      <Link to="/projects">← Back to Projects</Link>

      <h2 style={{ marginTop: 12 }}>{project.title}</h2>
      <p>Client: {project.clientName}</p>
      <p>Status: <b>{project.status}</b></p>
      <p style={{ fontSize: 13, color: "#555" }}>Created: {new Date(project.createdAt).toLocaleString()}</p>

      <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <h3>Update Status</h3>
        <select value={project.status} onChange={(e) => updateStatus(e.target.value)}>
          <option value="Planning">Planning</option>
          <option value="Design">Design</option>
          <option value="Licensing">Licensing</option>
          <option value="Execution">Execution</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={handleDelete}>Delete Project</button>
      </div>

      <div style={{ marginTop: 24, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
        <h3>Next modules (demo)</h3>
        <ul>
          <li><Link to="/documents">Documents</Link> (placeholder page)</li>
          <li><Link to="/meetings">Meetings</Link> (placeholder page)</li>
        </ul>
      </div>
    </div>
  );
}
