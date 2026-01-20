import React, { useEffect, useMemo, useState } from "react";

const PROJECTS_KEY = "projects";
const MEETINGS_KEY = "meetings"; // { [projectId]: [{id,title,date,time,createdAt}] }

function loadProjects() {
  const raw = localStorage.getItem(PROJECTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function loadMeetings() {
  const raw = localStorage.getItem(MEETINGS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveMeetings(all) {
  localStorage.setItem(MEETINGS_KEY, JSON.stringify(all));
}

export default function Meetings() {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [allMeetings, setAllMeetings] = useState({});

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const ps = loadProjects();
    setProjects(ps);
    setProjectId(ps[0]?.id || "");
    setAllMeetings(loadMeetings());
  }, []);

  const meetingsForProject = useMemo(() => {
    if (!projectId) return [];
    return allMeetings[projectId] || [];
  }, [allMeetings, projectId]);

  const canAdd = projectId && title.trim() && date && time;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!canAdd) return;

    const m = {
      id: Date.now().toString(),
      title: title.trim(),
      date,
      time,
      createdAt: new Date().toISOString(),
    };

    const nextAll = {
      ...allMeetings,
      [projectId]: [m, ...(allMeetings[projectId] || [])],
    };

    setAllMeetings(nextAll);
    saveMeetings(nextAll);

    setTitle("");
    setDate("");
    setTime("");
  };

  const handleDelete = (id) => {
    const nextList = (allMeetings[projectId] || []).filter((m) => m.id !== id);
    const nextAll = { ...allMeetings, [projectId]: nextList };
    setAllMeetings(nextAll);
    saveMeetings(nextAll);
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "Arial", padding: 12 }}>
      <h2>Meetings</h2>
      <p style={{ color: "#555" }}>
        Initial demo page: schedule meetings per project (saved locally).
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
                  {p.title} — {p.clientName}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleAdd} style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
            <h3>Schedule Meeting (demo)</h3>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              <input
                placeholder="Meeting title (e.g., Client review)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              <button type="submit" disabled={!canAdd}>
                Add
              </button>
            </div>
          </form>

          <div style={{ marginTop: 16 }}>
            <h3>Meetings List</h3>
            {meetingsForProject.length === 0 ? (
              <p>No meetings yet for this project.</p>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {meetingsForProject.map((m) => (
                  <div key={m.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                    <div style={{ fontWeight: "bold" }}>{m.title}</div>
                    <div style={{ fontSize: 13, color: "#555" }}>
                      {m.date} • {m.time} • {new Date(m.createdAt).toLocaleString()}
                    </div>
                    <button onClick={() => handleDelete(m.id)} style={{ marginTop: 8 }}>
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
