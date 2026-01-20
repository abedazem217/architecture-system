import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");

    setToken(t || null);

    try {
      setUser(u ? JSON.parse(u) : null);
    } catch {
      setUser(null);
    }

    setLoading(false);
  }, []);

  const saveSession = (data) => {
    // data expected: { _id, name, email, role, token }
    const sessionUser = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role, // ✅ role محفوظ هون
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(sessionUser));

    setToken(data.token);
    setUser(sessionUser);
  };

  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    saveSession(res.data);
    return res.data;
  };

  const register = async ({ name, email, password }) => {
    const res = await api.post("/auth/register", { name, email, password });
    // Auto-login after register
    saveSession(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
