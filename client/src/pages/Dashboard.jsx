import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Arial' }}>
      <h2>Dashboard</h2>
      <p style={{ marginTop: 10 }}>
        {user ? `Welcome, ${user.name} (${user.email})` : 'Welcome'}
      </p>

   <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
  <h3>Modules</h3>
  <ul>
    <li>Projects: create + update status</li>
    <li>Documents: add/list (demo)</li>
    <li>Meetings: schedule/list (demo)</li>
  </ul>

  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
    <button onClick={() => navigate("/projects")}>Open Projects</button>
    <button onClick={() => navigate("/documents")}>Open Documents</button>
    <button onClick={() => navigate("/meetings")}>Open Meetings</button>
  </div>
</div>

      <button onClick={handleLogout} style={{ marginTop: 20 }}>
        Logout
      </button>
    </div>
  );
}
