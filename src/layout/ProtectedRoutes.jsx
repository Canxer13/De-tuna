// File: src/layouts/ProtectedRoute.jsx
// Ini adalah "Satpam" untuk Rute Admin Anda

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // 1. Cek apakah ada 'authToken' di localStorage
  const token = localStorage.getItem("authToken");

  // 2. Logika Satpam
  if (!token) {
    // 3. Jika TIDAK ADA token, "tendang" pengguna ke halaman /login
    return <Navigate to="/login" replace />;
  }

  // 4. Jika ADA token, izinkan akses ke halaman yang diminta
  //    (Komponen <Outlet /> akan merender halaman admin)
  return <Outlet />;
};

export default ProtectedRoute;
