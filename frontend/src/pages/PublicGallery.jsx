import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const vintageTheme = {
  paperLight: "#f2e8cf",
  mediumBrown: "#5c4033",
  darkBrown: "#2b1d12",
  accentGold: "#a67c52",
  textSoft: "#d9c5b2",
};

function PublicGallery() {
  const { pseudo } = useParams();
  const [photos, setPhotos] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePhotoId, setActivePhotoId] = useState(null);

  const users = ["hafssa", "aicha", "kaoutar"];

  useEffect(() => {
    if (pseudo) {
      fetch(`http://localhost:8000/api/public/galleries/${pseudo}`)
        .then((res) => res.json())
        .then((data) => setPhotos(data))
        .catch((err) => console.error("Error fetching photos:", err));
    } else {
      setPhotos([]);
    }
  }, [pseudo]);

  // ✅ VERSION CORRECTE DOWNLOAD
  const handleDownload = (e, photo) => {
    e.stopPropagation();

    const url = `http://localhost:8000/api/photos/${photo.id}/download`;

    const link = document.createElement("a");
    link.href = url;
    link.download = photo.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const styles = {
    container: {
      display: "flex",
      height: "calc(100vh - 70px)",
      backgroundColor: vintageTheme.paperLight,
      fontFamily: "'Georgia', serif",
      overflow: "hidden",
    },
    sidebar: {
      width: isSidebarOpen ? "280px" : "0px",
      background: vintageTheme.mediumBrown,
      boxShadow: "inset -10px 0 20px rgba(0,0,0,0.2)",
      color: vintageTheme.textSoft,
      transition: "all 0.5s ease",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      whiteSpace: "nowrap",
    },
    sidebarContent: {
      padding: "40px 20px",
      opacity: isSidebarOpen ? 1 : 0,
    },
    sidebarTitleLink: {
      fontSize: "0.85rem",
      textTransform: "uppercase",
      letterSpacing: "2.5px",
      color: vintageTheme.accentGold,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: "20px",
      textDecoration: "none",
    },
    userLink: (isActive) => ({
      padding: "14px",
      borderRadius: "6px",
      textDecoration: "none",
      color: isActive ? vintageTheme.paperLight : vintageTheme.textSoft,
      background: isActive ? "rgba(43, 29, 18, 0.4)" : "transparent",
      marginBottom: "8px",
      display: "block",
    }),
    toggleBtn: {
      position: "fixed",
      left: isSidebarOpen ? "235px" : "15px",
      top: "85px",
      background: vintageTheme.darkBrown,
      color: vintageTheme.accentGold,
      padding: "5px 8px",
      cursor: "pointer",
      borderRadius: "4px",
      zIndex: 1000,
    },
    content: {
      flex: 1,
      padding: "30px 60px",
      overflowY: "auto",
    },
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: vintageTheme.paperLight }}>
      <Navbar />

      <button
        style={styles.toggleBtn}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      <div style={styles.container}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarContent}>
            <Link to="/public" style={styles.sidebarTitleLink}>
              Exploration
            </Link>

            <nav>
              {users.map((u) => (
                <Link
                  key={u}
                  to={`/public/${u}`}
                  style={styles.userLink(pseudo === u)}
                >
                  @{u}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main style={styles.content}>
          {!pseudo ? (
            <h2 style={{ textAlign: "center" }}>Select a curator</h2>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)", // 🔥 garde 3 images
                gap: "35px",
              }}
            >
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() =>
                    setActivePhotoId(
                      activePhotoId === photo.id ? null : photo.id
                    )
                  }
                  style={{
                    padding: "12px",
                    background: "#fff", // ✅ cadre blanc conservé
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    borderRadius: "2px",
                    position: "relative",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={`http://localhost:8000/uploads/${photo.filename}`}
                    alt={photo.originalName}
                    style={{
                      width: "100%",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                    }}
                  />

                  {activePhotoId === photo.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: "absolute",
                        left: "12px",
                        right: "12px",
                        bottom: "12px",
                        background: "rgba(43, 29, 18, 0.85)",
                        color: "#fff",
                        padding: "12px",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {photo.originalName}
                      </span>

                      <button
                        onClick={(e) => handleDownload(e, photo)}
                        style={{
                          background: vintageTheme.accentGold,
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "20px",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        ⬇ Télécharger
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default PublicGallery;