// File: src/admin/components/DataKamarTable.jsx
// Ini adalah kode LAMA Anda dari AdminDashboard, yang sudah dipindah

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../AdminDashboard.css"; // Kita pakai CSS yang sama

const DataKamarTable = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/admin/rooms"
        );
        setRooms(response.data.data);
      } catch (err) {
        setError("Gagal memuat data kamar.");
        console.error("Gagal fetch data kamar:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [navigate]); // (useEffect Anda tetap sama)

  return (
    <div className="content">
      {/* (1) HEADER KONTEN (Sesuai Gambar) */}
      <div className="content-header">
        <div className="content-header-left">
          <h2>Data Kamar</h2>
        </div>
        <div className="content-header-right">
          <div className="filters">
            <button className="filter-btn">Filters</button>
          </div>
          <div className="search-box">
            <input type="search" placeholder="Search" />
          </div>
        </div>
      </div>

      {/* (2) KONTAINER TABEL (Scrollable) */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nama Kamar</th>
              <th>Harga/Malam</th>
              <th>Kapasitas</th>
              <th>Luas</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6">Loading data kamar...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="6" style={{ color: "red" }}>
                  {error}
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              rooms.map((room) => (
                <tr key={room.room_id}>
                  <td>{room.name}</td>
                  <td>
                    Rp {Number(room.price_per_night).toLocaleString("id-ID")}
                  </td>
                  <td>{room.capacity} orang</td>
                  <td>{room.size}</td>
                  <td>{room.status}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/admin/view-room/${room.room_id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && !error && rooms.length === 0 && (
              <tr>
                <td colSpan="6">Tidak ada data kamar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* (3) FOOTER KONTEN (Tombol Add Item di Bawah) */}
      <div className="content-footer">
        <button className="add-btn">+ Add Item</button>
      </div>
    </div>
  );
};

export default DataKamarTable;
