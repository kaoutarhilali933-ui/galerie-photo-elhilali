import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/users", {
        email: email,
        pseudo: pseudo,
        age: parseInt(age),
        password: password,
      });

      console.log("Inscription réussie :", response.data);
      alert("Compte créé avec succès !");
      navigate("/login");
    } catch (error) {
      console.error("Erreur inscription :", error);
      alert("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Inscription</h2>
          <p className="auth-subtitle">
            Crée ton compte pour uploader et publier tes photos.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-row">
            <label className="auth-label">Pseudo</label>
            <input
              className="auth-input"
              type="text"
              placeholder="ex: Aicha"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
          </div>

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
            <label className="auth-label">Âge</label>
            <input
              className="auth-input"
              type="number"
              placeholder="ex: 21"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min={10}
              max={99}
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
              minLength={6}
            />
          </div>

          <button className="auth-btn" type="submit">
            Créer mon compte
          </button>
        </form>

        <div className="auth-footer">
          Déjà un compte ?{" "}
          <Link className="auth-link" to="/login">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;