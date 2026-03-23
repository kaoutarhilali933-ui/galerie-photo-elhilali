import { useEffect, useState } from "react";
import "./admin.css";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`Erreur suppression HTTP ${response.status}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/unblock`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, isBlocked: false, failedAttempts: 0 }
            : user
        )
      );
    } catch (error) {
      alert("Erreur lors du déblocage");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <h2 style={{ textAlign: "center", color: "#5c4033", marginTop: "40px" }}>
          Consulting archives...
        </h2>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <h2 style={{ textAlign: "center", color: "#721c24", marginTop: "40px" }}>
          Registry Error: {error}
        </h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="admin-registry-page">
        <style>{`
          .admin-registry-page {
            background-color: #f2e8cf !important;
            min-height: 100vh;
            font-family: 'Georgia', serif !important;
            color: #2b1d12;
            padding: 40px 20px;
          }
          .registry-container {
            max-width: 1200px;
            margin: 0 auto;
            border: 2px solid #a67c52;
            padding: 30px;
            background-color: rgba(255, 255, 255, 0.2);
            position: relative;
          }
          .registry-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 1px double #a67c52;
            padding-bottom: 20px;
          }
          .vintage-table {
            width: 100%;
            border-collapse: collapse;
            background: transparent !important;
          }
          .vintage-table th {
            border-bottom: 2px solid #5c4033;
            padding: 15px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 0.8rem;
            color: #5c4033;
          }
          .vintage-table td {
            padding: 15px;
            border-bottom: 1px solid rgba(166, 124, 82, 0.2);
            text-align: center;
          }
          .status-tag {
            padding: 4px 10px;
            font-size: 0.7rem;
            font-weight: bold;
            text-transform: uppercase;
            border-radius: 2px;
            color: white;
          }
          .btn-vintage {
            background: transparent;
            border: 1px solid #a67c52;
            color: #5c4033;
            padding: 5px 12px;
            cursor: pointer;
            font-size: 0.7rem;
            text-transform: uppercase;
            font-weight: bold;
            margin: 0 4px;
          }
          .btn-vintage:hover {
            background: #5c4033;
            color: #f2e8cf;
          }
          .btn-danger {
            border-color: #721c24;
            color: #721c24;
          }
          .btn-danger:hover {
            background: #721c24;
            color: white;
          }
        `}</style>

        <div className="registry-container">
          <header className="registry-header">
            <h1 style={{ fontSize: "2.5rem", letterSpacing: "5px", margin: 0 }}>
              Master Registry
            </h1>
            <p style={{ fontStyle: "italic", opacity: 0.7 }}>
              Official ledger of system curators
            </p>
          </header>

          <table className="vintage-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Identity (Email)</th>
                <th>Pseudo</th>
                <th>Role</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Photos</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ opacity: 0.5 }}>#{user.id}</td>
                  <td>{user.email}</td>
                  <td style={{ fontStyle: "italic" }}>@{user.pseudo}</td>
                  <td>
                    <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>
                      {user.roles.includes("ROLE_ADMIN") ? "ADMIN" : "CURATOR"}
                    </span>
                  </td>
                  <td>
                    <span
                      className="status-tag"
                      style={{
                        backgroundColor: user.isBlocked ? "#721c24" : "#155724",
                      }}
                    >
                      {user.isBlocked ? "Restricted" : "Active"}
                    </span>
                  </td>
                  <td>{user.failedAttempts}</td>
                  <td>{user.photosCount}</td>
                  <td>
                    <button
                      className="btn-vintage btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      ✕ Remove
                    </button>

                    {user.isBlocked && (
                      <button
                        className="btn-vintage"
                        onClick={() => handleUnblock(user.id)}
                      >
                        🔓 Authorize
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}