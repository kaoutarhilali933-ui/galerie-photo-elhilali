import { useEffect, useState } from "react";
import api from "../services/api";
import PhotoCard from "../components/PhotoCard";
import UploadModal from "../components/UploadModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import Navbar from "../components/Navbar";
import "./dashboard.css";

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

  const fetchPhotos = async () => {
    try {
      setLoading(true);

      // ✅ on charge seulement les photos du user connecté
      const response = await api.get("/my/photos");
      const items = Array.isArray(response.data) ? response.data : [];

      const sorted = [...items].sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );

      setPhotos(sorted);
    } catch (error) {
      console.error("Error loading photos", error);
      setPhotos([]);
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
      await api.patch(
        `/photos/${id}`,
        { publicOrder: order },
        {
          headers: { "Content-Type": "application/merge-patch+json" },
        }
      );

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

  useEffect(() => {
    fetchPhotos();
  }, []);

  const vStyles = {
    pageWrapper: {
      backgroundColor: vintageTheme.paper,
      minHeight: "100vh",
    },
    mainContainer: {
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
    actionBtn: {
      padding: "10px 20px",
      backgroundColor: vintageTheme.leather,
      color: vintageTheme.paper,
      border: `1px solid ${vintageTheme.leather}`,
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginLeft: "10px",
      transition: "all 0.3s ease",
    },
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
    }),
  };

  return (
    <div style={vStyles.pageWrapper}>
      <Navbar />

      <div style={vStyles.mainContainer}>
        <div style={vStyles.headerBox}>
          <div>
            <h1 style={vStyles.title}>Curator&apos;s Desk ✍️</h1>
            <p style={vStyles.subtitle}>Private Archive Management & Registry</p>
          </div>

          <div>
            <button
              style={vStyles.actionBtn}
              onClick={() => setShowModal(true)}
              onMouseOver={(e) => (e.target.style.backgroundColor = vintageTheme.gold)}
              onMouseOut={(e) => (e.target.style.backgroundColor = vintageTheme.leather)}
            >
              Add to Archive
            </button>
          </div>
        </div>

        {successMessage && (
          <div style={vStyles.alert(successMessage.includes("❌"))}>
            {successMessage}
          </div>
        )}

        <div className="photo-grid" style={{ gap: "40px" }}>
          {loading ? (
            <p style={{ textAlign: "center", fontStyle: "italic" }}>
              Consulting the archives...
            </p>
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
          <UploadModal onClose={() => setShowModal(false)} refreshPhotos={fetchPhotos} />
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
    </div>
  );
}

export default Dashboard;