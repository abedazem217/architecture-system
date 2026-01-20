import React, { useEffect, useMemo, useState } from "react";

const PROJECTS_KEY = "projects";
const DOCS_KEY = "documents"; // { [projectId]: [{id,name,type,createdAt}] }

function loadProjects() {
  const raw = localStorage.getItem(PROJECTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function loadDocs() {
  const raw = localStorage.getItem(DOCS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveDocs(allDocs) {
  localStorage.setItem(DOCS_KEY, JSON.stringify(allDocs));
}

export default function Documents() {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [allDocs, setAllDocs] = useState({});
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const ps = loadProjects();
    setProjects(ps);
    setProjectId(ps[0]?.id || "");
    setAllDocs(loadDocs());
  }, []);

  const docsForProject = useMemo(() => {
    if (!projectId) return [];
    return allDocs[projectId] || [];
  }, [allDocs, projectId]);

  const handleFakeUpload = (e) => {
    e.preventDefault();
    if (!projectId || !fileName.trim()) return;

    const newDoc = {
      id: Date.now().toString(),
      name: fileName.trim(),
      type: "PDF/IMG/DWG (demo)",
      createdAt: new Date().toISOString(),
    };

    const nextAll = {
      ...allDocs,
      [projectId]: [newDoc, ...(allDocs[projectId] || [])],
    };

    setAllDocs(nextAll);
    saveDocs(nextAll);
    setFileName("");
  };

  const handleDelete = (docId) => {
    const nextList = (allDocs[projectId] || []).filter((d) => d.id !== docId);
    const nextAll = { ...allDocs, [projectId]: nextList };
    setAllDocs(nextAll);
    saveDocs(nextAll);
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "Arial", padding: 12 }}>
      <h2>Documents</h2>
      <p style={{ color: "#555" }}>
        Initial demo page: choose a project and add documents (saved locally).
      </p>

      {projects.length === 0 ? (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          <b>No projects found.</b>
          <p>Create a project first from Projects page.</p>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
            <label style={{ display: "block", marginBottom: 8 }}>Select Project</label>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              {projects.map((p) => (
               <option key={p.id} value={p.id}>
  {p.name} — {p.client || "—"}
</option>

              ))}
            </select>
          </div>

          <form onSubmit={handleFakeUpload} style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
            <h3>Add Document (demo)</h3>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              <input
                placeholder="Document name (e.g., Plan v1.pdf)"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
              <button type="submit" disabled={!projectId || !fileName.trim()}>
                Add
              </button>
            </div>
          </form>

          <div style={{ marginTop: 16 }}>
            <h3>Documents List</h3>
            {docsForProject.length === 0 ? (
              <p>No documents yet for this project.</p>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {docsForProject.map((d) => (
                  <div key={d.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                    <div style={{ fontWeight: "bold" }}>{d.name}</div>
                    <div style={{ fontSize: 13, color: "#555" }}>
                      {d.type} • {new Date(d.createdAt).toLocaleString()}
                    </div>
                    <button onClick={() => handleDelete(d.id)} style={{ marginTop: 8 }}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
