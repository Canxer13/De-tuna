// File: src/admin/components/DataBookingTable.jsx
// Ini adalah tabel untuk "Jadwal Tamu" (Bookings)

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../AdminDashboard.css";

const DataBookingTable = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // (Sesuai api.php Anda)
        const response = await axios.get(
          "http://localhost:8000/api/v1/admin/bookings"
        );
        setBookings(response.data.data);
      } catch (err) {
        setError("Gagal memuat data booking.");
        console.error("Gagal fetch data booking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="content">
      <div className="content-header">
        <div className="content-header-left">
          <h2>Data Booking (Jadwal Tamu)</h2>
        </div>
        {/* ... (Filter/Search) ... */}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID Booking</th>
              <th>Nama Tamu</th>
              <th>Kamar</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6">Loading data booking...</td>
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
              bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  {" "}
                  {/* (Asumsi key) */}
                  <td>{booking.booking_code}</td>
                  {/* (API Anda mungkin perlu 'load' relasi ini) */}
                  <td>{booking.user ? booking.user.full_name : "N/A"}</td>
                  <td>{booking.room ? booking.room.name : "N/A"}</td>
                  <td>{booking.check_in_date}</td>
                  <td>{booking.check_out_date}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            {!loading && !error && bookings.length === 0 && (
              <tr>
                <td colSpan="6">Tidak ada data booking.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="content-footer">
        {/* (Tidak ada tombol 'Add Booking' di admin biasanya) */}
      </div>
    </div>
  );
};

export default DataBookingTable;
