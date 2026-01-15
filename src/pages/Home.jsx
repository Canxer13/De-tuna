import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });

  // State untuk menampung data kamar populer
  const [popularRooms, setPopularRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA KAMAR POPULER ---
  useEffect(() => {
    const fetchPopularRooms = async () => {
      try {
        // ✅ UPDATE: URL sudah diganti jadi 'popular-rooms' agar tidak bentrok dengan ID
        const response = await axios.get(
          "import.meta.env.VITE_API_BASE_URL/api/v1/popular-rooms"
        );
        if (response.data.success) {
          setPopularRooms(response.data.data);
        }
      } catch (error) {
        console.error("Gagal memuat kamar populer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRooms();
  }, []);

  const handleSearch = () => {
    navigate(`/Rooms?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`);
  };

  // --- KLIK CARD MENUJU DETAIL ---
  const handleCardClick = (roomId) => {
    navigate(`/room-detail/${roomId}`);
  };

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="overlay">
          <h1>Welcome De Tuna</h1>
          <p>
            Enjoy the tranquility and beauty of nature in a warm and relaxing
            atmosphere.
          </p>

          <div className="booking-bar">
            <div className="booking-item">
              <label htmlFor="arrival">Arrival</label>
              <input
                type="date"
                onChange={(e) =>
                  setDates({ ...dates, checkIn: e.target.value })
                }
              />
            </div>
            <div className="booking-item">
              <label htmlFor="departure">Departure</label>
              <input
                type="date"
                onChange={(e) =>
                  setDates({ ...dates, checkOut: e.target.value })
                }
              />
            </div>
            <button onClick={handleSearch}>BOOK NOW</button>
          </div>
        </div>
      </section>

      {/* ===== WELCOME SECTION ===== */}
      <section className="welcome">
        <h2>Welcome to De Tuna Resort</h2>
        <p>
          Enjoy the serenity of the ocean breeze and luxurious tropical
          surroundings. De Tuna Resort offers a sanctuary of relaxation with
          stunning views and elegant comfort.
        </p>
        <img src="/image/home tengah ke 2.png" alt="Resort Pool" />
      </section>

      {/* ===== WHY US SECTION ===== */}
      <section className="why-us">
        <div className="why-text">
          <h3>Why us?</h3>
          <p>
            Nikmati pengalaman menginap yang tak terlupakan di De Tuna Resort,
            destinasi terbaik untuk bersantai, berpetualang, dan menikmati
            keindahan alam. Kami menghadirkan perpaduan sempurna antara
            kenyamanan modern dan pesona alam tropis.
          </p>
          <div className="why-icons">
            <div>
              <img src="/image/home tengah kecil 1.png" alt="Rooms" />
              <p>Luxury Rooms</p>
            </div>
            <div>
              <img src="/image/home tengah kecil 2.png" alt="Restaurant" />
              <p>Fine Dining</p>
            </div>
            <div>
              <img src="/image/home tengah kecil 3.png" alt="Pool" />
              <p>Infinity Pool</p>
            </div>
          </div>
        </div>
        <img
          src="/image/home tengah besar.png"
          alt="Luxury Room"
          className="why-img"
        />
      </section>

      {/* ===== OFFER SECTION (DYNAMIC) ===== */}
      <section className="offers">
        <h3>Most Popular Rooms</h3>
        <p>Kamar favorit pilihan tamu kami untuk liburan sempurna Anda!</p>

        <div className="offer-cards">
          {loading ? (
            <p>Loading offers...</p>
          ) : popularRooms.length > 0 ? (
            popularRooms.map((room) => (
              <div
                className="card"
                key={room.room_id}
                onClick={() => handleCardClick(room.room_id)}
                style={{ cursor: "pointer" }}
              >
                {/* Tampilkan Foto Pertama dari DB atau Placeholder */}
                <img
                  src={
                    room.photos && room.photos.length > 0
                      ? room.photos[0].photo_url
                      : "/image/home kolom 1.png"
                  }
                  alt={room.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <h4>{room.name}</h4>
                {/* Format Harga Rupiah */}
                <p>
                  Rp {parseFloat(room.price_per_night).toLocaleString("id-ID")}{" "}
                  / night
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Mencegah double click event
                    handleCardClick(room.room_id);
                  }}
                >
                  Book Now
                </button>
              </div>
            ))
          ) : (
            <p>Belum ada data kamar populer.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
