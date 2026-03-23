import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let roles = [];
  let isLoggedIn = false;
  let isAdmin = false;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      roles = payload.roles || [];
      isLoggedIn = true;
      isAdmin = roles.includes("ROLE_ADMIN");
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/public");
  };

  const vintageTheme = {
    darkBar: "#2b1d12",
    accentGold: "#a67c52",
    paperLight: "#f2e8cf",
  };

  const navStyles = {
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.8rem 3rem",
      background: vintageTheme.darkBar,
      color: vintageTheme.paperLight,
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      borderBottom: `1px solid ${vintageTheme.accentGold}`,
      fontFamily: "'Georgia', serif",
      zIndex: 1100,
      position: "relative",
    },
    logoSection: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "22px",
      fontWeight: "bold",
      color: vintageTheme.paperLight,
      textDecoration: "none",
    },
    navLinks: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
    },
    link: {
      color: vintageTheme.paperLight,
      textDecoration: "none",
      fontSize: "14px",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      fontWeight: "500",
      transition: "color 0.3s ease",
      cursor: "pointer",
    },
    separator: {
      color: vintageTheme.accentGold,
      opacity: 0.5,
    },
    button: {
      background: "transparent",
      border: "none",
      color: vintageTheme.paperLight,
      fontSize: "14px",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      fontWeight: "500",
      cursor: "pointer",
      fontFamily: "'Georgia', serif",
      transition: "color 0.3s ease",
    },
  };

  return (
    <nav style={navStyles.header}>
      <Link to="/public" style={navStyles.logoSection}>
        <span style={{ fontSize: "24px" }}>📷</span>
        <span>GalleryApp</span>
        <span style={{ color: vintageTheme.accentGold, margin: "0 10px" }}>—</span>
      </Link>

      <div style={navStyles.navLinks}>
        <Link
          to="/public"
          style={navStyles.link}
          onMouseEnter={(e) => (e.target.style.color = vintageTheme.accentGold)}
          onMouseLeave={(e) => (e.target.style.color = vintageTheme.paperLight)}
        >
          Public
        </Link>

        <span style={navStyles.separator}>•</span>

        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              style={navStyles.link}
              onMouseEnter={(e) => (e.target.style.color = vintageTheme.accentGold)}
              onMouseLeave={(e) => (e.target.style.color = vintageTheme.paperLight)}
            >
              Login
            </Link>

            <span style={navStyles.separator}>•</span>

            <Link
              to="/register"
              style={navStyles.link}
              onMouseEnter={(e) => (e.target.style.color = vintageTheme.accentGold)}
              onMouseLeave={(e) => (e.target.style.color = vintageTheme.paperLight)}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {isAdmin ? (
              <Link
                to="/admin"
                style={navStyles.link}
                onMouseEnter={(e) => (e.target.style.color = vintageTheme.accentGold)}
                onMouseLeave={(e) => (e.target.style.color = vintageTheme.paperLight)}
              >
                Admin
              </Link>
            ) : (
              <Link
                to="/dashboard"
                style={navStyles.link}
                onMouseEnter={(e) => (e.target.style.color = vintageTheme.accentGold)}
                onMouseLeave={(e) => (e.target.style.color = vintageTheme.paperLight)}
              >
                Dashboard
              </Link>
            )}

            <span style={navStyles.separator}>•</span>

            <button
              type="button"
              style={navStyles.button}
              onClick={handleLogout}
              onMouseEnter={(e) => (e.target.style.color = vintageTheme.accentGold)}
              onMouseLeave={(e) => (e.target.style.color = vintageTheme.paperLight)}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;