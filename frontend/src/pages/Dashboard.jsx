import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PhotoCard from "../components/PhotoCard";
import UploadModal from "../components/UploadModal";
import "./dashboard.css";

function Dashboard() {
  const [photos, setPhotos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchPhotos = async () => {
    try {
      setLoading(true);

      const response = await api.get("/photos");
      console.log("GET /photos response:", response.data);

      const items = response.data.member || response.data["hydra:member"] || [];

      const sorted = [...items].sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );

      setPhotos(sorted);
    } catch (error) {
      console.error("Error loading photos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this photo?")) {
      try {
        await api.delete(`/photos/${id}`);
        setPhotos((prevPhotos) => prevPhotos.filter((p) => p.id !== id));
      } catch (error) {
        alert("Error while deleting photo");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title-block">
          <h1>My Private Gallery 📸</h1>
          <p className="dashboard-subtitle">
            Organize, preview and manage your personal photo collection
          </p>
        </div>

        <div className="dashboard-actions">
          <button className="upload-button" onClick={() => setShowModal(true)}>
            Upload Photo
          </button>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="photo-grid">
        {loading ? (
          <p className="status-text">Loading photos...</p>
        ) : photos.length > 0 ? (
          photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onDelete={() => handleDelete(photo.id)}
            />
          ))
        ) : (
          <p className="status-text">No photos yet.</p>
        )}
      </div>

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          refreshPhotos={fetchPhotos}
        />
      )}
    </div>
  );
}

export default Dashboard;