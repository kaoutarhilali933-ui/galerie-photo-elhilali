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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await api.post("/users", {
        email: email,
        pseudo: pseudo,
        age: parseInt(age),
        password: password,
      });

      console.log("Registration successful:", response.data);
      setSuccessMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        const data = error.response.data;
        const message = JSON.stringify(data).toLowerCase();

        if (
          message.includes("pseudo") ||
          message.includes("duplicate entry")
        ) {
          setErrorMessage("This username already exists.");
        } else if (message.includes("email")) {
          setErrorMessage("This email already exists.");
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
      } else {
        setErrorMessage("Server unreachable. Please try again later.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Register</h2>
          <p className="auth-subtitle">
            Create your account to upload and publish your photos.
          </p>
        </div>

        {errorMessage && (
          <div className="auth-error">
            ⚠ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="auth-success">
            ✅ {successMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-row">
            <label className="auth-label">Username</label>
            <input
              className="auth-input"
              type="text"
              placeholder="e.g. kaoutar"
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
              placeholder="e.g. kaoutar@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-row">
            <label className="auth-label">Age</label>
            <input
              className="auth-input"
              type="number"
              placeholder="e.g. 21"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min={10}
              max={99}
            />
          </div>

          <div className="auth-row">
            <label className="auth-label">Password</label>
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
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link className="auth-link" to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;