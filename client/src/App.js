import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Documents from "./pages/Documents";
import Meetings from "./pages/Meetings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App layout */}
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
  path="/projects"
  element={
    <ProtectedRoute roles={["admin", "architect"]}>
      <Projects />
    </ProtectedRoute>
  }
/>

          <Route
  path="/projects/:id"
  element={
    <ProtectedRoute roles={["admin", "architect"]}>
      <ProjectDetails />
    </ProtectedRoute>
  }
/>


          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meetings"
            element={
              <ProtectedRoute>
                <Meetings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Not found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
