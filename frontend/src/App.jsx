import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicGallery from "./pages/PublicGallery";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/public" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/public" element={<PublicGallery />} />
      <Route path="/public/:pseudo" element={<PublicGallery />} />

      <Route path="*" element={<h2>Page introuvable</h2>} />
    </Routes>
  );
}

export default App;