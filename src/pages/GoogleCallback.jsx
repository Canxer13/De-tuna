import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Memproses login...");

  useEffect(() => {
    const processLogin = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const roleParam = params.get("role");

      if (!token) {
        setStatus("Gagal: Token tidak ditemukan.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        setStatus("Mengambil profil user...");
        localStorage.setItem("authToken", token);

        // ✅ Gunakan Backticks (``) - JANGAN PAKAI TANDA KUTIP BIASA
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ PENANGANAN STRUKTUR DATA (Bisa response.data.data atau response.data)
        const userData = response.data?.data || response.data;

        if (userData && (userData.role || roleParam)) {
          const finalRole = userData.role || roleParam;

          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("userRole", finalRole);

          setStatus("Login Berhasil! Mengalihkan...");

          setTimeout(() => {
            if (finalRole === "admin" || finalRole === "super_admin") {
              window.location.href = "/admin/dashboard";
            } else {
              window.location.href = "/";
            }
          }, 1000);
        } else {
          console.error("Struktur profil tidak dikenali:", response.data);
          throw new Error("Struktur data user tidak sesuai.");
        }
      } catch (error) {
        console.error("Gagal verifikasi:", error);
        setStatus(`Gagal: ${error.message || "Cek koneksi backend"}`);
        localStorage.clear();
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    processLogin();
  }, [location, navigate]);

  return (
    <div style={styles.container}>
      <div className="spinner" style={styles.spinner}></div>
      <p style={styles.text}>{status}</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px",
  },
  text: { fontSize: "16px", color: "#555" },
};

export default GoogleCallback;
