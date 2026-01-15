// (1) Impor semua hook yang kita butuhkan
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useParams untuk ambil ID
import axios from "axios";
import "./ViewRooms.css"; // Impor CSS khusus

const ViewRoom = () => {
  // (2) Ambil 'id' dari URL (contoh: /admin/view-room/1)
  const { id } = useParams();
  const navigate = useNavigate();

  // (3) Siapkan state untuk menyimpan data
  const [room, setRoom] = useState(null); // Mulai dari null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // (4) useEffect untuk mengambil data TEPAT SAAT halaman dibuka
  useEffect(() => {
    // Ambil token dari localStorage (hasil dari login)
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Akses ditolak. Silakan login dulu.");
      setLoading(false);
      navigate("/login"); // Tendang ke login jika tidak ada token
      return;
    }

    const fetchRoom = async () => {
      try {
        // (5) Panggil API admin Anda (sesuai api.php)
        const response = await axios.get(
          `http://localhost:8000/api/v1/admin/rooms/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // (6) Kirim token untuk otorisasi
            },
          }
        );

        // (7) Simpan data kamar ke state
        // (API Anda membungkus data di dalam properti 'data')
        setRoom(response.data.data);
        setError(null);
      } catch (err) {
        setError("Gagal mengambil data kamar.");
        console.error("Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, navigate]); // (8) Jalankan ulang jika 'id' berubah

  // (9) Tampilkan status loading atau error
  if (loading)
    return (
      <div className="view-room-body">
        <p>Loading data kamar...</p>
      </div>
    );
  if (error)
    return (
      <div className="view-room-body">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  if (!room)
    return (
      <div className="view-room-body">
        <p>Data kamar tidak ditemukan.</p>
      </div>
    );

  // (10) Jika data sudah ada, tampilkan form
  return (
    // (11) Ganti style inline dengan className
    <div className="view-room-body">
      <div className="container">
        <header>
          <button
            className="back-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            ←
          </button>
          <button className="edit-btn">Edit</button>
        </header>

        <main>
          <div className="room-section">
            <img
              // (12) Tampilkan foto pertama dari kamar
              src={
                room.photos && room.photos[0]
                  ? room.photos[0].photo_url
                  : "/image/home tengah besar.png"
              }
              alt={room.name}
              className="room-img"
            />

            <div className="form-grid">
              {/* (13) Hubungkan input dengan data dari state (pakai '|| ""' agar aman) */}
              <div className="input-group">
                <label>Nama</label>
                <input type="text" value={room.name || ""} readOnly />
              </div>
              <div className="input-group">
                <label>Tipe Kasur</label>
                <input type="text" value={room.bed_type || ""} readOnly />
              </div>

              <div className="input-group">
                <label>Kapasitas</label>
                <input type="text" value={room.capacity || ""} readOnly />
              </div>
              <div className="input-group">
                <label>Ukuran</label>
                <input type="text" value={room.size || ""} readOnly />
              </div>
              <div className="input-group">
                <label>Status</label>
                <input type="text" value={room.status || ""} readOnly />
              </div>
              <div className="input-group">
                <label>Harga/Malam</label>
                <input
                  type="text"
                  value={room.price_per_night || ""}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="desc-section">
            <label>Deskripsi</label>
            <textarea value={room.description || ""} readOnly></textarea>
          </div>

          <div className="fasilitas-section">
            <h3>Fasilitas</h3>
            <table>
              <thead>
                <tr>
                  <th>ID Facilities</th>
                  <th>Name</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {/* (14) Tampilkan daftar fasilitas kamar */}
                {room.facilities &&
                  room.facilities.map((facility) => (
                    <tr key={facility.facility_id}>
                      <td>{facility.facility_id}</td>
                      <td>{facility.facility_name}</td>
                      <td>{facility.type || "N/A"}</td>
                    </tr>
                  ))}
                <tr>
                  <td colSpan="3" className="add-facility">
                    Add Facilities
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewRoom;
