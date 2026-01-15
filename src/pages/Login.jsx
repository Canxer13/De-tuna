import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil URL Base dari Environment Variable
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ✅ PERBAIKAN: Gunakan Backticks (``) dan ${} agar variabel terbaca
      const response = await axios.post(`${BASE_URL}/api/v1/login`, {
        email: email,
        password: password,
      });

      setLoading(false);

      const authData = response.data.data;
      const token = authData.token;
      const user = authData.user;
      const userRole = user.role;

      // Simpan ke LocalStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("user", JSON.stringify(user));

      // Force Refresh & Redirect
      if (userRole === "admin" || userRole === "super_admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login gagal. Silakan coba lagi.");
      }
      console.error("Login gagal:", err);
    }
  };

  const handleGoogleLogin = () => {
    // ✅ PERBAIKAN: Gunakan Backticks untuk redirect Google
    window.location.href = `${BASE_URL}/api/v1/auth/google`;
  };

  return (
    <div className="login-body" style={{ display: "flex", height: "100vh" }}>
      <div
        className="left-side"
        style={{ backgroundImage: "url('/image/login.png')" }}
      ></div>

      <div className="right-side">
        <div className="login-container">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#">Forget Password ?</a>

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <div
            style={{ display: "flex", alignItems: "center", margin: "20px 0" }}
          >
            <div style={{ flex: 1, height: "1px", background: "#ccc" }}></div>
            <span
              style={{ padding: "0 10px", color: "#777", fontSize: "14px" }}
            >
              ATAU
            </span>
            <div style={{ flex: 1, height: "1px", background: "#ccc" }}></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#fff",
              color: "#333",
              border: "1px solid #ccc",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "16px",
            }}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              style={{ width: "20px", height: "20px" }}
            />
            Masuk dengan Google
          </button>

          <div className="register-link">
            <Link to="/register">Don't Have Account? Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
