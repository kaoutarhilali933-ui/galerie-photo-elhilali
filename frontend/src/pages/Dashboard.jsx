import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PhotoCard from "../components/PhotoCard";
import UploadModal from "../components/UploadModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import "./dashboard.css";

// Palette de couleurs partagée avec la galerie publique
const vintageTheme = {
  paper: "#f2e8cf",
  ink: "#2b1d12",
  gold: "#a67c52",
  leather: "#5c4033",
  danger: "#721c24",
  success: "#155724",
};

function Dashboard() {
  const [photos, setPhotos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/photos");
      const items = response.data.member || response.data["hydra:member"] || [];
      const sorted = [...items].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      setPhotos(sorted);
    } catch (error) {
      console.error("Error loading photos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedPhotoId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPhotoId) return;
    try {
      await api.delete(`/photos/${selectedPhotoId}`);
      setPhotos((prev) => prev.filter((p) => p.id !== selectedPhotoId));
      setShowDeleteModal(false);
      setSelectedPhotoId(null);
      setSuccessMessage("✅ Photo archived and removed");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting photo:", error);
      setShowDeleteModal(false);
      setSelectedPhotoId(null);
      setSuccessMessage("❌ Error while deleting photo");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handlePublish = async (id, publicOrder) => {
    const order = parseInt(publicOrder, 10);
    if (isNaN(order) || order <= 0) {
      setSuccessMessage("❌ Invalid index number");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }
    try {
      await api.patch(`/photos/${id}`, { publicOrder: order }, {
        headers: { "Content-Type": "application/merge-patch+json" },
      });
      setSuccessMessage("✅ Collection updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchPhotos();
    } catch (error) {
      console.error("Publish error:", error);
      let errorMessage = "❌ Error while publishing";
      if (error.response?.data) {
        const apiError = error.response.data;
        errorMessage = `❌ ${apiError.detail || apiError.message || "Operation failed"}`;
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

  // Styles Inline pour le thème Vintage
  const vStyles = {
    mainContainer: {
      backgroundColor: vintageTheme.paper,
      minHeight: "100vh",
      padding: "40px 20px",
      fontFamily: "'Georgia', serif",
      color: vintageTheme.ink,
    },
    headerBox: {
      borderBottom: `2px solid ${vintageTheme.gold}`,
      marginBottom: "40px",
      paddingBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    title: {
      fontSize: "2.5rem",
      textTransform: "uppercase",
      letterSpacing: "4px",
      margin: 0,
    },
    subtitle: {
      fontStyle: "italic",
      opacity: 0.8,
      fontSize: "1.1rem",
    },
    actionBtn: (isLogout) => ({
      padding: "10px 20px",
      backgroundColor: isLogout ? "transparent" : vintageTheme.leather,
      color: isLogout ? vintageTheme.leather : vintageTheme.paper,
      border: `1px solid ${vintageTheme.leather}`,
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginLeft: "10px",
      transition: "all 0.3s ease",
    }),
    alert: (isError) => ({
      background: isError ? "#f8d7da" : "#d4edda",
      color: isError ? vintageTheme.danger : vintageTheme.success,
      border: `1px solid ${isError ? vintageTheme.danger : vintageTheme.success}`,
      padding: "15px 25px",
      borderRadius: "2px",
      marginBottom: "30px",
      fontWeight: "bold",
      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
      width: "fit-content",
    })
  };

  return (
    <div style={vStyles.mainContainer}>
      <div style={vStyles.headerBox}>
        <div>
          <h1 style={vStyles.title}>Curator's Desk ✍️</h1>
          <p style={vStyles.subtitle}>Private Archive Management & Registry</p>
        </div>

        <div>
          <button
            style={vStyles.actionBtn(false)}
            onClick={() => setShowModal(true)}
            onMouseOver={(e) => e.target.style.backgroundColor = vintageTheme.gold}
            onMouseOut={(e) => e.target.style.backgroundColor = vintageTheme.leather}
          >
            Add to Archive
          </button>

          <button 
            style={vStyles.actionBtn(true)} 
            onClick={handleLogout}
            onMouseOver={(e) => {
                e.target.style.backgroundColor = vintageTheme.leather;
                e.target.style.color = vintageTheme.paper;
            }}
            onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = vintageTheme.leather;
            }}
          >
            Leave Desk
          </button>
        </div>
      </div>

      {successMessage && (
        <div style={vStyles.alert(successMessage.includes("❌"))}>
          {successMessage}
        </div>
      )}

      {/* Grid avec un espacement plus large pour le look "classeur" */}
      <div className="photo-grid" style={{ gap: "40px" }}>
        {loading ? (
          <p style={{ textAlign: "center", fontStyle: "italic" }}>Consulting the archives...</p>
        ) : photos.length > 0 ? (
          photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onDelete={() => handleDeleteClick(photo.id)}
              onPublish={(order) => handlePublish(photo.id, order)}
            />
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "100px", opacity: 0.5 }}>
             <span style={{ fontSize: "50px" }}>📔</span>
             <p>No records found in this collection.</p>
          </div>
        )}
      </div>

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          refreshPhotos={fetchPhotos}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPhotoId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default Dashboard;