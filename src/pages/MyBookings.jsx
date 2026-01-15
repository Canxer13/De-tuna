import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyBookings.css"; // Kita buat CSS-nya setelah ini

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Review Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Data Booking User
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "import.meta.env.VITE_API_BASE_URL/api/v1/my-bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(response.data.data);
    } catch (err) {
      console.error("Gagal load booking", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 2. Handle Buka Modal Review
  const handleOpenReview = (bookingId) => {
    setSelectedBookingId(bookingId);
    setReviewData({ rating: 5, comment: "" }); // Reset form
    setShowReviewModal(true);
  };

  // 3. Handle Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "import.meta.env.VITE_API_BASE_URL/api/v1/reviews",
        {
          booking_id: selectedBookingId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Terima kasih atas ulasan Anda!");
      setShowReviewModal(false);
      // Opsional: Refresh booking list jika ingin disable tombol review setelah submit
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal mengirim ulasan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-bookings-container">
      <h2>Riwayat Pemesanan Saya</h2>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length > 0 ? (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.booking_id}>
              <div className="booking-header">
                <span className="booking-code">#{booking.booking_code}</span>
                <span className={`status-badge ${booking.payment_status}`}>
                  {booking.payment_status}
                </span>
              </div>

              <div className="booking-body">
                <h3>{booking.room?.name || "Room Deleted"}</h3>
                <p>📅 Check-in: {booking.check_in_date}</p>
                <p>📅 Check-out: {booking.check_out_date}</p>
                <p>
                  💰 Total: Rp{" "}
                  {parseFloat(booking.total_price).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="booking-actions">
                {/* Tombol Bayar (Jika belum bayar) */}
                {booking.payment_status === "pending" && (
                  <button className="btn-pay">Bayar Sekarang</button>
                )}

                {/* Tombol Review (Hanya jika sudah Paid/Confirmed) */}
                {/* Kamu bisa ubah logikanya, misal hanya muncul kalau status == 'checkout' */}
                {booking.payment_status === "paid" && (
                  <button
                    className="btn-review"
                    onClick={() => handleOpenReview(booking.booking_id)}
                  >
                    ⭐ Beri Ulasan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Belum ada riwayat pemesanan.</p>
      )}

      {/* MODAL REVIEW */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Tulis Ulasan</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <select
                  value={reviewData.rating}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, rating: e.target.value })
                  }
                >
                  <option value="5">⭐⭐⭐⭐⭐ (Sangat Puas)</option>
                  <option value="4">⭐⭐⭐⭐ (Puas)</option>
                  <option value="3">⭐⭐⭐ (Cukup)</option>
                  <option value="2">⭐⭐ (Kurang)</option>
                  <option value="1">⭐ (Sangat Buruk)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Komentar</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Ceritakan pengalaman menginap Anda..."
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="btn-cancel"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-save"
                >
                  {submitting ? "Mengirim..." : "Kirim Ulasan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
