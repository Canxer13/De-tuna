import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom"; // Hapus useNavigate karena tidak dipakai
import axios from "axios";
import "./Booking.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Booking = () => {
  const location = useLocation();
  // const navigate = useNavigate(); <--- HAPUS INI (Penyebab Error 1)

  // Ambil data kamar dari state navigasi
  const { room, checkIn, checkOut, guests } = location.state || {};

  // State Logic Promo
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. HITUNG HARGA DASAR
  const bookingSummary = useMemo(() => {
    if (!room || !checkIn || !checkOut) return { nights: 0, subtotal: 0 };

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const price = parseFloat(room.price_per_night) || 0;
    const subtotal = diffDays > 0 ? diffDays * price : 0;

    return { nights: diffDays, subtotal };
  }, [room, checkIn, checkOut]);

  // 2. HITUNG DISKON & TOTAL AKHIR
  const finalTotal = useMemo(() => {
    const discountAmount = (bookingSummary.subtotal * discountPercent) / 100;
    return bookingSummary.subtotal - discountAmount;
  }, [bookingSummary.subtotal, discountPercent]);

  // --- FUNCTION CEK PROMO KE BACKEND ---
  const handleCheckPromo = async () => {
    if (!promoCode) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}/api/v1/check-promo`,
        { promo_code: promoCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setDiscountPercent(response.data.discount_percentage);
        setIsPromoApplied(true);
        setPromoMessage(
          `✅ Kode Diterima! Hemat ${response.data.discount_percentage}%`
        );
      }
    } catch (error) {
      console.error(error); // <--- PAKAI VARIABEL ERROR (Solusi Error 2)
      setDiscountPercent(0);
      setIsPromoApplied(false);
      setPromoMessage("❌ Kode promo tidak valid atau kadaluarsa.");
    }
  };

  const handlePayNow = async () => {
    if (!window.snap) {
      alert("Midtrans belum siap. Refresh halaman.");
      return;
    }

    setIsProcessing(true);
    const token = localStorage.getItem("authToken");

    const bookingData = {
      room_id: room?.room_id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      guests: parseInt(guests),
      total_price: finalTotal, // Gunakan harga setelah diskon
      first_name: "Pelanggan",
      last_name: "De Tuna",
      email: "customer@example.com",
      phone: "081234567890",
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1//bookings`,
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const snapToken =
        response.data.snap_token || response.data.data?.snap_token;

      if (snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            console.log("Success!", result);
            window.location.href = "http://localhost:5173/my-bookings";
          },
          onPending: function (result) {
            console.log("Pending!", result);
            window.location.href = "http://localhost:5173/my-bookings";
          },
          onError: function (result) {
            console.error("Payment Error:", result); // <--- PAKAI VARIABEL RESULT (Solusi Error 3)
            alert("Pembayaran Gagal.");
          },
          onClose: function () {
            alert("Anda menutup popup tanpa menyelesaikan pembayaran.");
          },
        });
      }
      // ... kode try ...
    } catch (err) {
      console.error("Booking Error Detail:", err);

      // TANGKAP PESAN ERROR DARI BACKEND
      const serverMessage =
        err.response?.data?.message || "Terjadi kesalahan server.";

      // TAMPILKAN DI ALERT
      alert("Gagal Booking: " + serverMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!room)
    return (
      <div className="error-msg">
        Data kamar tidak ditemukan. Silakan pilih kamar ulang.
      </div>
    );

  return (
    <div className="booking-outer-container">
      <div className="booking-summary-card">
        <h2 className="summary-title">Booking Summary</h2>

        <div className="room-info-box">
          <div className="room-image-small">
            <img
              src={room.photos?.[0]?.photo_url || "/placeholder.jpg"}
              alt={room.name}
            />
          </div>
          <div className="room-text-small">
            <h3>{room.name}</h3>
            <p>Max Guest: {room.capacity}</p>
          </div>
        </div>

        <div className="details-list">
          <div className="detail-item">
            <span>Check-in</span>
            <strong>{checkIn}</strong>
          </div>
          <div className="detail-item">
            <span>Check-out</span>
            <strong>{checkOut}</strong>
          </div>
          <div className="detail-item">
            <span>Guest</span>
            <strong>{guests} Persons</strong>
          </div>
          <div className="detail-item">
            <span>Duration</span>
            <strong>{bookingSummary.nights} Night(s)</strong>
          </div>
        </div>

        <div className="payment-divider"></div>

        {/* --- FITUR KODE PROMO --- */}
        <div className="promo-section">
          <label>Kode Promo</label>
          <div className="promo-input-group">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Masukkan Kode"
              disabled={isPromoApplied}
            />
            <button onClick={handleCheckPromo} disabled={isPromoApplied}>
              {isPromoApplied ? "Terpakai" : "Cek"}
            </button>
          </div>
          {promoMessage && (
            <p className={`promo-msg ${isPromoApplied ? "success" : "error"}`}>
              {promoMessage}
            </p>
          )}
        </div>

        <div className="payment-divider"></div>

        {/* --- RINCIAN HARGA --- */}
        <div className="price-details">
          <div className="price-row">
            <span>Subtotal</span>
            <span>Rp {bookingSummary.subtotal.toLocaleString("id-ID")}</span>
          </div>

          {isPromoApplied && (
            <div className="price-row discount">
              <span>Diskon ({discountPercent}%)</span>
              <span>
                - Rp{" "}
                {(
                  (bookingSummary.subtotal * discountPercent) /
                  100
                ).toLocaleString("id-ID")}
              </span>
            </div>
          )}

          <div className="price-row total">
            <span>Total Payment</span>
            <span className="amount-text">
              Rp {finalTotal.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <button
          className="pay-now-button"
          onClick={handlePayNow}
          disabled={isProcessing}
        >
          {isProcessing ? "Memproses..." : "BAYAR SEKARANG"}
        </button>
        <p className="security-note">🔒 Secure Payment by Midtrans</p>
      </div>
    </div>
  );
};

export default Booking;
