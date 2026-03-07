import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{
      padding: "40px",
      textAlign: "center",
      fontFamily: "Arial"
    }}>

      <h1>Dashboard</h1>

      <p>Bienvenue dans ta galerie privée 📸</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff4d4f",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Se déconnecter
      </button>

    </div>
  );
}

export default Dashboard;