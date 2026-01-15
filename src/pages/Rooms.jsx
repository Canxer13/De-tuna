import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Rooms.css";

// Ambil URL Base dari Environment Variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Rooms = () => {
  // State Data Kamar & Loading
  // Inisialisasi dengan array kosong [] agar tidak undefined saat awal render
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Search Bar (Filter Tanggal)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [checkIn, setCheckIn] = useState(
    queryParams.get("check_in_date") || ""
  );
  const [checkOut, setCheckOut] = useState(
    queryParams.get("check_out_date") || ""
  );
  const [guests, setGuests] = useState(queryParams.get("guests") || 1);

  // --- PERBAIKAN: Gunakan dependency array [] agar TIDAK infinite loop ---
  useEffect(() => {
    fetchRooms();
  }, []); // Hanya berjalan 1x saat halaman dibuka

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // Logic Filter ke API menggunakan Backticks
      let url = `${BASE_URL}/api/v1/rooms`;
      const params = [];
      if (checkIn) params.push(`check_in_date=${checkIn}`);
      if (checkOut) params.push(`check_out_date=${checkOut}`);

      if (params.length > 0) {
        url += "?" + params.join("&");
      }

      const response = await axios.get(url);

      // --- PERBAIKAN: Pastikan data adalah array agar .map() tidak error ---
      // Jika response.data.data tidak ada, maka gunakan array kosong []
      setRooms(response.data?.data || []);
    } catch (error) {
      console.error("Gagal mengambil data kamar:", error);
      setRooms([]); // Set ke array kosong jika terjadi error API
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRooms(); // Panggil ulang API saat tombol Cari ditekan
  };

  return (
    <div className="rooms-page-container">
      {/* --- 1. BAGIAN SEARCH BAR (ATAS) --- */}
      <div className="search-bar-container">
        <div className="search-item">
          <label>Check In</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div className="search-item">
          <label>Check Out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div className="search-item">
          <label>Tamu</label>
          <div className="guest-input-wrapper">
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
            <span>Tamu</span>
          </div>
        </div>
        <button className="btn-search" onClick={handleSearch}>
          Cari
        </button>
      </div>

      <div className="rooms-content-wrapper">
        {/* --- 2. BAGIAN SIDEBAR FILTER (KIRI) --- */}
        <aside className="filters-sidebar">
          <div className="filter-box">
            <h3>Fasilitas Resort</h3>
            <div className="filter-option">
              <input type="checkbox" id="wifi" />{" "}
              <label htmlFor="wifi">Free Wifi</label>
            </div>
            <div className="filter-option">
              <input type="checkbox" id="pool" />{" "}
              <label htmlFor="pool">Swimming Pool</label>
            </div>
            <div className="filter-option">
              <input type="checkbox" id="breakfast" />{" "}
              <label htmlFor="breakfast">Breakfast</label>
            </div>
            <div className="filter-actions">
              <button className="btn-apply-filter">Terapkan Filter</button>
              <button className="btn-reset-filter">Hapus Semua</button>
            </div>
          </div>
        </aside>

        {/* --- 3. BAGIAN DAFTAR KAMAR (KANAN) --- */}
        <main className="rooms-main-list">
          {loading ? (
            <div className="loading-text">Mencari kamar terbaik...</div>
          ) : rooms && rooms.length > 0 ? (
            <div className="rooms-grid">
              {/* Gunakan optional chaining untuk keamanan tambahan */}
              {rooms.map((room) => {
                const isAvailable = room.is_available !== false;
                const stock = room.available_stock ?? room.stock;

                return (
                  <div
                    key={room.room_id}
                    className={`room-card ${
                      !isAvailable ? "sold-out-card" : ""
                    }`}
                  >
                    {!isAvailable && (
                      <div className="sold-out-overlay">
                        <span className="sold-out-badge">HABIS</span>
                      </div>
                    )}

                    <div className="room-image-wrapper">
                      <img
                        src={
                          room.photos && room.photos.length > 0
                            ? room.photos[0].photo_url
                            : "/placeholder.jpg"
                        }
                        alt={room.name}
                        className="room-img"
                      />
                    </div>

                    <div className="room-info">
                      <div className="room-header-flex">
                        <h3 className="room-name">{room.name}</h3>
                        <span className="room-price">
                          Rp{" "}
                          {parseFloat(room.price_per_night).toLocaleString(
                            "id-ID"
                          )}
                        </span>
                      </div>

                      <p className="room-capacity">
                        Max Guest: {room.capacity} Orang
                      </p>

                      {isAvailable && stock <= 3 && stock > 0 && (
                        <p className="stock-warning">🔥 Sisa {stock} kamar!</p>
                      )}

                      <div className="room-actions">
                        {isAvailable ? (
                          <Link
                            to={`/rooms/${room.room_id}`}
                            state={{ checkIn, checkOut, guests }}
                            className="btn-detail"
                          >
                            Lihat Detail
                          </Link>
                        ) : (
                          <button className="btn-disabled" disabled>
                            Tidak Tersedia
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-rooms">
              Maaf, tidak ada kamar yang tersedia untuk tanggal tersebut.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Rooms;
