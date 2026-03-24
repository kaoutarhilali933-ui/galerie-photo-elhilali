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
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (pseudo) {
      fetch(`http://localhost:8000/api/public/galleries/${pseudo}`)
        .then((res) => res.json())
        .then((data) => setPhotos(Array.isArray(data) ? data : []))
        .catch((err) => {
          console.error("Error fetching photos:", err);
          setPhotos([]);
        });
    } else {
      setPhotos([]);
    }
  }, [pseudo]);

  useEffect(() => {
    fetch("http://localhost:8000/api/public/users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching public users:", err);
        setUsers([]);
      });
  }, []);

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
      transition: "all 0.5s cubic-bezier(0.77, 0, 0.175, 1)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      whiteSpace: "nowrap",
    },
    sidebarContent: {
      padding: "40px 20px",
      opacity: isSidebarOpen ? 1 : 0,
      transition: "opacity 0.3s ease",
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
      display: "block",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    userLink: (isActive) => ({
      padding: "14px 18px",
      borderRadius: "6px",
      textDecoration: "none",
      color: isActive ? vintageTheme.paperLight : vintageTheme.textSoft,
      background: isActive ? "rgba(43, 29, 18, 0.4)" : "transparent",
      border: isActive
        ? `1px solid ${vintageTheme.accentGold}`
        : "1px solid transparent",
      display: "block",
      marginBottom: "8px",
      transition: "all 0.2s ease",
      fontWeight: isActive ? "bold" : "normal",
    }),
    toggleBtn: {
      position: "fixed",
      left: isSidebarOpen ? "235px" : "15px",
      top: "85px",
      zIndex: 1000,
      background: vintageTheme.darkBrown,
      border: `1px solid ${vintageTheme.accentGold}`,
      color: vintageTheme.accentGold,
      padding: "5px 8px",
      cursor: "pointer",
      borderRadius: "4px",
      transition: "all 0.5s ease",
    },
    content: {
      flex: 1,
      padding: "30px 60px",
      overflowY: "auto",
    },
    headerArea: {
      marginBottom: "60px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    badgeWrapper: {
      display: "inline-block",
      border: `3px double ${vintageTheme.accentGold}`,
      padding: "20px 60px",
      position: "relative",
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1), inset 0 0 15px rgba(166, 124, 82, 0.1)",
      borderRadius: "2px",
    },
    badgeBolt: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: vintageTheme.accentGold,
      boxShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    },
    cornerSquare: {
      position: "absolute",
      width: "12px",
      height: "12px",
      background: vintageTheme.paperLight,
      border: `1px solid ${vintageTheme.accentGold}`,
    },
    mainTitle: {
      fontSize: "2.2rem",
      margin: 0,
      letterSpacing: "8px",
      textTransform: "uppercase",
      color: vintageTheme.darkBrown,
      fontWeight: "900",
      textShadow: "1px 1px 0px rgba(255,255,255,0.5)",
      fontFamily: "'Times New Roman', serif",
    },
    curatorText: {
      marginTop: "15px",
      color: vintageTheme.mediumBrown,
      fontStyle: "italic",
      fontSize: "1.1rem",
    },
    welcomeSection: {
      textAlign: "center",
      marginTop: "60px",
      color: vintageTheme.mediumBrown,
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
            <Link
              to="/public"
              style={styles.sidebarTitleLink}
              onMouseEnter={(e) => (e.target.style.letterSpacing = "4px")}
              onMouseLeave={(e) => (e.target.style.letterSpacing = "2.5px")}
            >
              Exploration
            </Link>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "5px",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  width: "25px",
                  height: "1px",
                  background: vintageTheme.accentGold,
                }}
              ></div>
              <span style={{ fontSize: "10px", color: vintageTheme.accentGold }}>
                ◆
              </span>
              <div
                style={{
                  width: "25px",
                  height: "1px",
                  background: vintageTheme.accentGold,
                }}
              ></div>
            </div>

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
          <header style={styles.headerArea}>
            <div style={styles.badgeWrapper}>
              <div style={{ ...styles.badgeBolt, left: "15px" }}></div>
              <div style={{ ...styles.badgeBolt, right: "15px" }}></div>

              <div style={{ ...styles.cornerSquare, top: "-8px", left: "-8px" }}></div>
              <div style={{ ...styles.cornerSquare, top: "-8px", right: "-8px" }}></div>
              <div style={{ ...styles.cornerSquare, bottom: "-8px", left: "-8px" }}></div>
              <div style={{ ...styles.cornerSquare, bottom: "-8px", right: "-8px" }}></div>

              <h1 style={styles.mainTitle}>Public Gallery</h1>
            </div>

            {pseudo ? (
              <p style={styles.curatorText}>
                — Record of:{" "}
                <span
                  style={{
                    color: vintageTheme.darkBrown,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {pseudo}
                </span>{" "}
                —
              </p>
            ) : (
              <p
                style={{
                  ...styles.curatorText,
                  letterSpacing: "4px",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  opacity: 0.7,
                }}
              >
                Access to Collections
              </p>
            )}
          </header>

          {!pseudo ? (
            <div style={styles.welcomeSection}>
              <span style={{ fontSize: "80px", opacity: 0.2 }}>🏛️</span>
              <h2 style={{ color: vintageTheme.darkBrown, marginTop: "20px" }}>
                Welcome to the Archives
              </h2>
              <p
                style={{
                  maxWidth: "500px",
                  margin: "10px auto",
                  lineHeight: "1.6",
                  fontStyle: "italic",
                }}
              >
                Select a curator from the exploration menu on the left to discover
                their collection of curated visual memories.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "35px",
              }}
            >
              {photos.length > 0 ? (
                photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() =>
                      setActivePhotoId(activePhotoId === photo.id ? null : photo.id)
                    }
                    style={{
                      padding: "12px",
                      background: "#fff",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      borderRadius: "2px",
                      transition: "transform 0.3s ease",
                      position: "relative",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <img
                      src={`http://localhost:8000/uploads/${photo.filename}`}
                      alt={photo.originalName}
                      loading="lazy"
                      decoding="async"
                      onLoad={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      style={{
                        width: "100%",
                        aspectRatio: "1/1",
                        objectFit: "cover",
                        filter: "sepia(0.15) contrast(1.1)",
                        opacity: 0,
                        transform: "scale(1.01)",
                        transition: "opacity 0.4s ease, transform 0.4s ease",
                        backgroundColor: "#e7dcc5",
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
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                        >
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
                            whiteSpace: "nowrap",
                            fontWeight: "bold",
                          }}
                        >
                          ⬇ Télécharger
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    marginTop: "50px",
                    opacity: 0.5,
                  }}
                >
                  <p>No photos found in this archive.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default PublicGallery;