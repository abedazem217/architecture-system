import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await register(form);
      setMessage(`✅ Welcome, ${res.name}`);
      navigate("/dashboard");
    } catch (err) {
      const apiMsg = err?.response?.data?.message;
      setMessage(apiMsg || "❌ Registration failed.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/">Login</Link>
      </p>

      {message && (
        <p style={{ marginTop: 20, color: message.startsWith("✅") ? "green" : "crimson" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Register;
