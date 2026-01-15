// File: src/pages/Register.jsx (PERBAIKAN CSS)

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// (1) IMPOR BIASA (TANPA 'styles')
import "./Register.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Password dan Konfirmasi Password tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/v1/register`, {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      });

      setLoading(false);
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registrasi gagal. Silakan coba lagi.");
      }
      console.error("Registrasi gagal:", err);
    }
  };

  return (
    // (2) GUNAKAN 'className' BIASA (STRING)
    <div className="register-body" style={{ display: "flex", height: "100vh" }}>
      <div
        className="left-side"
        style={{ backgroundImage: "url('/image/sign up.png')" }}
      ></div>

      <div className="right-side">
        <div className="signup-container">
          <h2>Sign up</h2>

          <form onSubmit={handleRegister}>
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}

            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Mendaftar..." : "Sign Up"}
            </button>
          </form>
          <div className="login-link">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
