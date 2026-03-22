import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicGallery from "./pages/PublicGallery";

function App() {
  return (
    <Routes>
      {/* redirection accueil */}
      <Route path="/" element={<Navigate to="/public" />} />

      {/* auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* dashboard protégé */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* galerie publique */}
      <Route path="/public" element={<PublicGallery />} />
      <Route path="/public/:pseudo" element={<PublicGallery />} />

      {/* 404 */}
      <Route path="*" element={<h2>Page introuvable</h2>} />
    </Routes>
  );
}

export default App;