// File: src/App.jsx (LENGKAP DAN SUDAH DIPERBAIKI)

import { Routes, Route } from "react-router-dom";

// PERBAIKAN: Hapus huruf 's' di "layout"
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import AdminLayout from "./layout/AdminLayout";
import ProtectedRoute from "./layout/ProtectedRoutes"; // <-- Impor "Satpam"

// (2) Impor Halaman Publik
import ProfileSettings from "./pages/ProfileSetting";
import MyBookings from "./pages/MyBookings";
import GoogleCallback from "./pages/GoogleCallback";
import Home from "./pages/Home";
import About from "./pages/About";
import Rooms from "./pages/Rooms";
import Contact from "./pages/Contact";
import RoomDetail from "./pages/RoomDetail"; // <-- Nama variabel diperbaiki
import Booking from "./pages/Booking";
import Login from "./pages/Login";

import Register from "./pages/Register";

// (3) Impor Halaman Admin
import AdminDashboard from "./admin/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Rute Publik (Dengan Navbar & Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/about" element={<About />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/room-detail/:id" element={<RoomDetail />} />
      </Route>

      {/* Rute Autentikasi (Tanpa Navbar/Footer) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* (4) Rute Admin (SEKARANG SUDAH AMAN) */}
      <Route element={<ProtectedRoute />}>
        {" "}
        <Route element={<AdminLayout />}>
          {" "}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
