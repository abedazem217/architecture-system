import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const pageTitle = {
    "/dashboard": "Dashboard",
    "/projects": "Projects",
    "/documents": "Documents",
    "/meetings": "Meetings",
  };

  return (
    <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0 }}>
          {pageTitle[window.location.pathname] || "Architect Office"}
        </h3>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/documents">Documents</Link>
        <Link to="/meetings">Meetings</Link>

        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ opacity: 0.8, fontSize: 14 }}>
            {user?.name ? `Hi, ${user.name}` : user?.email}
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
