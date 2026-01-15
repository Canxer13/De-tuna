// (1) Impor hook
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddFasilitas.css"; // Impor CSS khusus

const AddFasilitas = () => {
  const navigate = useNavigate();

  // (2) Siapkan state untuk setiap input di form
  // (Saya sesuaikan dengan 3 input di form Anda)
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [icon, setIcon] = useState(""); // Asumsi input kecil kedua adalah 'icon'

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // (3) Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    setLoading(true);
    setError(null);

    // Ambil token
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Akses ditolak. Silakan login dulu.");
      setLoading(false);
      navigate("/login");
      return;
    }

    // (4) Siapkan data untuk dikirim
    const facilityData = {
      name: name,
      type: type,
      icon_url: icon, // (Sesuaikan nama 'icon' ini dengan API Anda)
    };

    try {
      // (5) Kirim data ke API (sesuai api.php)
      await axios.post(
        "http://localhost:8000/api/v1/admin/resort-facilities",
        facilityData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // (6) Jika sukses, beri tahu admin dan kembali ke dashboard
      alert("Fasilitas baru berhasil ditambahkan!");
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Gagal menambahkan fasilitas.");
      console.error("Error adding facility:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // (7) Ganti div pembungkus dengan className
    <div className="add-fasilitas-body">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <button className="edit-btn">Edit</button>

        {/* (8) Ubah .content menjadi <form> */}
        <form className="content" onSubmit={handleSubmit}>
          <div className="room-image">
            <img src="/image/home tengah besar.png" alt="Kamar" />
          </div>

          <div className="form">
            {/* Tampilkan error jika ada */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* (9) Hubungkan input dengan state */}
            <input
              type="text"
              placeholder="Nama Fasilitas (Cth: WiFi Gratis)"
              className="input-large"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="row">
              <input
                type="text"
                placeholder="Tipe (Cth: Kamar)"
                className="input-small"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Icon (Cth: wifi)"
                className="input-small"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>
            {/* (10) Ganti tombol 'Add' menjadi 'submit' */}
            <button type="submit" className="add-btn" disabled={loading}>
              {loading ? "Menyimpan..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFasilitas;
