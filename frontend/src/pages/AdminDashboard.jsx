import { useEffect, useState } from "react";

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

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?"
    );

    if (!confirmDelete) return;

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

      if (!response.ok) {
        throw new Error(`Erreur suppression HTTP ${response.status}`);
      }

      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      alert("Erreur lors de la suppression");
      console.error(error);
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

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, isBlocked: false, failedAttempts: 0 }
            : user
        )
      );
    } catch (error) {
      alert("Erreur lors du déblocage");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <h2>Chargement...</h2>;
  if (error) return <h2>Erreur : {error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Pseudo</th>
            <th>Âge</th>
            <th>Rôles</th>
            <th>Bloqué</th>
            <th>Essais</th>
            <th>Photos</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.pseudo}</td>
              <td>{user.age}</td>

              <td>
                {user.roles.includes("ROLE_ADMIN")
                  ? "ROLE_ADMIN"
                  : "ROLE_USER"}
              </td>

              <td>{user.isBlocked ? "Oui" : "Non"}</td>
              <td>{user.failedAttempts}</td>
              <td>{user.photosCount}</td>

              <td>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{ marginRight: "5px" }}
                >
                  ❌ Supprimer
                </button>

                {user.isBlocked && (
                  <button onClick={() => handleUnblock(user.id)}>
                    🔓 Débloquer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}