import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      const apiMsg = err?.response?.data?.message;
      setMsg(apiMsg || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: 12 }}>
        No account? <Link to="/register">Register</Link>
      </p>

      {msg && <p style={{ marginTop: 12, color: "crimson" }}>{msg}</p>}
    </div>
  );
}
