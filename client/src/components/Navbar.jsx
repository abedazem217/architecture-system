import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <div style={{ padding: 12, borderBottom: "1px solid #eee", fontFamily: "Arial" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/documents">Documents</Link>
        <Link to="/meetings">Meetings</Link>

        <div style={{ marginLeft: "auto" }}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
