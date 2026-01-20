import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [form, setForm] = useState({
    name: "",
    client: "",
    status: "Active",
    deadline: "",
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      return (
        (p.name || "").toLowerCase().includes(q) ||
        (p.client || "").toLowerCase().includes(q) ||
        (p.status || "").toLowerCase().includes(q)
      );
    });
  }, [projects, query]);

  const addProject = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Project name is required");

    try {
      const res = await api.post("/projects", form);
      setProjects((prev) => [res.data, ...prev]);
      setForm({ name: "", client: "", status: "Active", deadline: "" });
    } catch (e2) {
      alert(e2?.response?.data?.message || "Create failed");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
      <h2 style={{ marginTop: 0 }}>Projects</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <input
          placeholder="Search (name/client/status)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={fetchProjects}>Refresh</button>
      </div>

      <form onSubmit={addProject} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Project name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Client"
          value={form.client}
          onChange={(e) => setForm({ ...form, client: e.target.value })}
        />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Active</option>
          <option>On Hold</option>
          <option>Completed</option>
        </select>
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>

      <hr style={{ margin: "16px 0" }} />

      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div>No projects yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 12,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ opacity: 0.8, fontSize: 14 }}>
                  Client: {p.client || "-"} | Status: {p.status || "-"} | Deadline: {p.deadline || "-"}
                </div>
              </div>

              <Link to={`/projects/${p._id}`}>Open</Link>
              <button onClick={() => deleteProject(p._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
