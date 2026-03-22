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
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const fetchPhotos = async () => {
    try {
      setLoading(true);

      const response = await api.get("/photos");
      console.log("GET /photos response:", response.data);

      const items =
        response.data.member || response.data["hydra:member"] || [];

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
        setPhotos((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting photo:", error);
        setSuccessMessage("❌ Error while deleting photo");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    }
  };

  const handlePublish = async (id, publicOrder) => {
    const order = parseInt(publicOrder, 10);

    if (isNaN(order) || order <= 0) {
      setSuccessMessage("❌ Please enter a valid positive number");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    try {
      const response = await api.patch(
        `/photos/${id}`,
        { publicOrder: order },
        {
          headers: {
            "Content-Type": "application/merge-patch+json",
          },
        }
      );

      console.log("Publish response:", response.data);

      setSuccessMessage("✅ Photo published successfully");
      setTimeout(() => setSuccessMessage(""), 3000);

      fetchPhotos();
    } catch (error) {
      console.error("Publish error:", error);

      let errorMessage = "❌ Error while publishing";

      if (error.response?.data) {
        const apiError = error.response.data;

        if (typeof apiError === "string") {
          errorMessage = `❌ ${apiError}`;
        } else if (apiError.detail) {
          errorMessage = `❌ ${apiError.detail}`;
        } else if (apiError.message) {
          errorMessage = `❌ ${apiError.message}`;
        }
      }

      setSuccessMessage(errorMessage);
      setTimeout(() => setSuccessMessage(""), 4000);
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
          <button
            className="upload-button"
            onClick={() => setShowModal(true)}
          >
            Upload Photo
          </button>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {successMessage && (
        <div
          style={{
            background: successMessage.includes("❌")
              ? "#f8d7da"
              : "#d4edda",
            color: successMessage.includes("❌")
              ? "#721c24"
              : "#155724",
            padding: "12px 20px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontWeight: "600",
            width: "fit-content",
          }}
        >
          {successMessage}
        </div>
      )}

      <div className="photo-grid">
        {loading ? (
          <p className="status-text">Loading photos...</p>
        ) : photos.length > 0 ? (
          photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onDelete={() => handleDelete(photo.id)}
              onPublish={(order) => handlePublish(photo.id, order)}
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