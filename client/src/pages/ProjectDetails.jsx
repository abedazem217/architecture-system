import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("Active");
  const [note, setNote] = useState("");

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setStatus(res.data.status || "Active");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load project");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line
  }, [id]);

  const updateStatus = async () => {
    try {
      const res = await api.put(`/projects/${id}`, { status });
      setProject(res.data);
      alert("Saved ✅");
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    try {
      const res = await api.put(`/projects/${id}`, { note });
      setProject(res.data);
      setNote("");
    } catch (e) {
      alert(e?.response?.data?.message || "Add note failed");
    }
  };

  const deleteProject = async () => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!project) return null;

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
      <Link to="/projects">← Back</Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ marginBottom: 6 }}>{project.name}</h2>
        <button onClick={deleteProject}>Delete</button>
      </div>

      <div style={{ opacity: 0.85 }}>
        Client: {project.client || "-"} | Deadline: {project.deadline || "-"}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Active</option>
          <option>On Hold</option>
          <option>Completed</option>
        </select>
        <button onClick={updateStatus}>Save</button>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <h3 style={{ marginTop: 0 }}>Notes</h3>
      <form onSubmit={addNote} style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="Write a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Add</button>
      </form>

      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {(project.notes || []).map((n) => (
          <div key={n._id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
            <div>{n.text}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
            </div>
          </div>
        ))}
        {(project.notes || []).length === 0 && <div>No notes yet.</div>}
      </div>
    </div>
  );
}
