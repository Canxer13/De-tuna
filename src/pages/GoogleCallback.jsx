// File: src/pages/GoogleCallback.jsx

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const GoogleCallback = () => {
  const location = useLocation();
  const [status, setStatus] = useState("Memproses login...");

  useEffect(() => {
    const processLogin = async () => {
      // 1. Ambil token & role dari URL
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const roleParam = params.get("role"); // Role sementara dari URL

      if (!token) {
        setStatus("Gagal: Token tidak ditemukan.");
        setTimeout(() => (window.location.href = "/login"), 2000);
        return;
      }

      try {
        setStatus("Mengambil data profil...");

        // 2. Simpan token dulu agar bisa request ke API
        localStorage.setItem("authToken", token);

        // 3. Minta data User lengkap ke API (karena di URL cuma ada token)
        const response = await axios.get(
          "import.meta.env.VITE_API_BASE_URL/api/v1/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data.data; // Asumsi respon: { data: { ...user... } }

        // 4. Simpan Data User Lengkap ke LocalStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userRole", userData.role || roleParam);

        setStatus("Login berhasil! Mengalihkan...");

        // 5. Redirect & Refresh (PENTING: Pakai window.location)
        if (userData.role === "admin" || userData.role === "super_admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
        setStatus("Gagal memverifikasi akun.");
        // Bersihkan jika gagal
        localStorage.removeItem("authToken");
        setTimeout(() => (window.location.href = "/login"), 3000);
      }
    };

    processLogin();
  }, [location]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #b67b3f",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px",
        }}
      ></div>
      <p>{status}</p>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
};

export default GoogleCallback;
