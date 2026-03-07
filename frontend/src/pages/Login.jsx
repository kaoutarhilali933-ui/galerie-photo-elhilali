import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login_check", {
        email: email,
        password: password,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);

      console.log("TOKEN :", token);
      alert("Connexion réussie !");

      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur connexion :", error);

      if (error.response) {
        alert("Email ou mot de passe incorrect.");
      } else {
        alert("Erreur serveur.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Connexion</h2>
          <p className="auth-subtitle">
            Accède à ta galerie privée et gère tes photos.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-row">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="ex: aicha@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-row">
            <label className="auth-label">Mot de passe</label>
            <input
              className="auth-input"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" type="submit">
            Se connecter
          </button>
        </form>

        <div className="auth-footer">
          Pas de compte ?{" "}
          <Link className="auth-link" to="/register">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;