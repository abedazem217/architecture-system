import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (roles && roles.length > 0) {
    const ok = roles.includes(user?.role);
    if (!ok) return <Navigate to="/dashboard" replace />;
  }

  return children;
}
