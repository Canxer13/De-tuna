import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RoomDetails.css";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State untuk data booking
  const [checkIn, setCheckIn] = useState(location.state?.checkIn || "");
  const [checkOut, setCheckOut] = useState(location.state?.checkOut || "");
  const [guests, setGuests] = useState(1); // Error hilang karena sekarang dipakai di bawah

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        let url = `import.meta.env.VITE_API_BASE_URL/api/v1/rooms/${id}`;
        if (checkIn && checkOut) {
          url += `?check_in_date=${checkIn}&check_out_date=${checkOut}`;
        }

        const response = await axios.get(url);
        setRoom(response.data.data);
      } catch (error) {
        console.error("Error fetching room detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [id, checkIn, checkOut]);

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert("Silakan pilih tanggal check-in dan check-out terlebih dahulu.");
      return;
    }

    // Pindah ke halaman booking dengan membawa data tamu
    navigate("/booking", {
      state: { room, checkIn, checkOut, guests },
    });
  };

  if (loading) return <div className="loading-state">Loading Detail...</div>;
  if (!room) return <div className="error-state">Kamar tidak ditemukan.</div>;

  // Cek status ketersediaan
  const isAvailable = room.is_available !== false;
  const stock = room.available_stock ?? room.stock;

  return (
    <div className="detail-container">
      <div className="detail-header">
        <img
          src={
            room.photos && room.photos.length > 0
              ? room.photos[0].photo_url
              : "/placeholder.jpg"
          }
          alt={room.name}
          className="detail-img"
        />
      </div>

      <div className="detail-content">
        <h1 className="room-title">{room.name}</h1>
        <p className="detail-price">
          Rp {parseFloat(room.price_per_night).toLocaleString("id-ID")} / malam
        </p>
        <div className="room-desc">
          <p>{room.description}</p>
          <p>
            <strong>Fasilitas:</strong> {room.facilities}
          </p>
          <p>
            <strong>Kapasitas:</strong> {room.capacity} Orang
          </p>
        </div>

        <hr className="divider" />

        {/* Form Simulasi Booking */}
        <div className="booking-form-box">
          <h3>Atur Jadwal Menginap</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Check-In</label>
              <input
                type="date"
                className="form-input"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Check-Out</label>
              <input
                type="date"
                className="form-input"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            {/* INPUT TAMU (Solusi Error Lint) */}
            <div className="form-group">
              <label>Jumlah Tamu</label>
              <input
                type="number"
                className="form-input"
                min="1"
                max={room.capacity} // Batasi sesuai kapasitas kamar
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>
          </div>

          {/* STATUS STOK / TOMBOL BOOKING */}
          <div className="action-area">
            {isAvailable ? (
              <>
                {stock <= 3 && stock > 0 && (
                  <p className="warning-text">
                    🔥 Buruan! Sisa {stock} kamar lagi di tanggal ini.
                  </p>
                )}
                <button className="btn-book-now" onClick={handleBooking}>
                  Lanjut Pemesanan
                </button>
              </>
            ) : (
              <div className="alert-box-error">
                ❌ <strong>Maaf, Kamar Penuh!</strong> <br />
                Stok kamar ini sudah habis untuk periode tanggal yang dipilih.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
