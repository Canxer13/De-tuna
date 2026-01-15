// File: src/components/Navbar.jsx

import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios"; // JANGAN LUPA IMPORT AXIOS
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // --- FUNGSI CEK LOGIN & AMBIL DATA TERBARU ---
    const checkLogin = async () => {
      const token = localStorage.getItem("authToken");
      const localUser = localStorage.getItem("user");

      if (token) {
        setIsLoggedIn(true);

        // 1. Tampilkan data dari LocalStorage dulu (Biar cepat muncul/gak kedip)
        if (localUser) {
          try {
            setUser(JSON.parse(localUser));
          } catch (e) {
            console.error("Error parse local user", e);
          }
        }

        // 2. FETCH DATA TERBARU DARI SERVER (PENTING!)
        // Ini gunanya agar kalau foto profil berubah, Navbar ikut berubah
        try {
          const response = await axios.get(
            "http://localhost:8000/api/v1/me/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const freshUserData = response.data.data;

          // Update State dengan data baru (yang ada fotonya)
          setUser(freshUserData);

          // Update juga LocalStorage biar sinkron
          localStorage.setItem("user", JSON.stringify(freshUserData));
        } catch (error) {
          console.error("Gagal refresh data user:", error);
          // Jika token expired, bisa logout otomatis (opsional)
          // handleLogout();
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    // Jalankan saat pertama kali load
    checkLogin();

    // Listener untuk login/logout realtime
    const handleAuthChange = () => {
      checkLogin();
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);

    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img
          src="/image/logo.png"
          alt="De Tuna Resort Logo"
          className="nav-logo"
        />
        <span className="nav-name">De Tuna Resort</span>
      </div>

      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/rooms"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Rooms
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Contact
        </NavLink>

        {/* --- USER MENU --- */}
        {isLoggedIn && user ? (
          <div className="user-menu-container">
            <div
              className="user-menu"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {/* LOGIKA FOTO: Cek User DB -> Fallback ke UI Avatars */}
              <img
                src={
                  user.profile_picture ||
                  `https://ui-avatars.com/api/?name=${user.full_name}&background=random`
                }
                alt="Profile"
                className="user-avatar"
              />
              <span className="user-name">{user.full_name}</span>
              <span className="dropdown-arrow">▼</span>
            </div>

            {showDropdown && (
              <div className="dropdown-menu">
                <Link
                  to="/my-bookings"
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="dropdown-item logout-item"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn-book">
            Login/Regis
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
