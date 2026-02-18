import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import ApplyGatePass from "./pages/student/ApplyGatePass";
import StudentHistory from "./pages/student/StudentHistory";

import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import CoordinatorHistory from "./pages/coordinator/CoordinatorHistory";

import HodDashboard from "./pages/hod/HodDashboard";
import HodHistory from "./pages/hod/HodHistory";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/apply"
        element={
          <ProtectedRoute role="student">
            <ApplyGatePass />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/history"
        element={
          <ProtectedRoute role="student">
            <StudentHistory />
          </ProtectedRoute>
        }
      />

      {/* Coordinator routes */}
      <Route
        path="/coordinator/dashboard"
        element={
          <ProtectedRoute role="coordinator">
            <CoordinatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/history"
        element={
          <ProtectedRoute role="coordinator">
            <CoordinatorHistory />
          </ProtectedRoute>
        }
      />

      {/* HOD routes */}
      <Route
        path="/hod/dashboard"
        element={
          <ProtectedRoute role="hod">
            <HodDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hod/history"
        element={
          <ProtectedRoute role="hod">
            <HodHistory />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
