import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    try {
      const response = await api.post("/login_check", {
        email: email,
        password: password,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);

      navigate("/dashboard");

    } catch (error) {

      if (error.response) {

        const message =
          error.response.data.message ||
          error.response.data.error ||
          "Authentication error";

        setErrorMessage(message);

      } else {
        setErrorMessage("Server not reachable");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <h2 className="auth-title">Login</h2>
          <p className="auth-subtitle">
            Sign in to access your private gallery and manage your photos.
          </p>
        </div>

        {errorMessage && (
          <div className="auth-error">
            ⚠ {errorMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="auth-row">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-row">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" type="submit">
            Sign In
          </button>

        </form>

        <div className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link className="auth-link" to="/register">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;