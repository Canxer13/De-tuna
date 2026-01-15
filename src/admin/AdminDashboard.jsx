import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // --- STATE UTAMA ---
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- STATE STATISTIK ---
  const [stats, setStats] = useState({
    total_revenue: 0,
    bookings_month: 0,
    total_users: 0,
    avg_rating: 0,
    popular_rooms: [],
  });

  // --- STATE MODAL & FORM ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]); // Untuk File Gambar
  const [selectedFacilities, setSelectedFacilities] = useState([]); // Untuk Checkbox Fasilitas

  // --- STATE MASTER DATA ---
  const [masterFacilities, setMasterFacilities] = useState([]); // List Fasilitas untuk Form Room

  // --- 1. CONFIG ENDPOINT ---
  const getEndpoint = (tab) => {
    switch (tab) {
      case "users":
        return "users";
      case "rooms":
        return "rooms";
      case "facilities":
        return "resort-facilities";
      case "promo":
        return "promotions";
      case "messages":
        return "messages";
      case "logs":
        return "logs";
      case "reviews":
        return "reviews";
      default:
        return "users";
    }
  };

  // --- 2. FETCH DASHBOARD STATS (Sekali saat load) ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/admin/dashboard-stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error("Gagal load stats", err);
      }
    };
    fetchStats();
  }, [token]);

  // --- 3. FETCH TABEL DATA ---
  const fetchData = async () => {
    if (activeTab === "dashboard") return;
    setLoading(true);
    setDataList([]);

    try {
      const endpoint = getEndpoint(activeTab);
      // URL Builder
      const url = `http://localhost:8000/api/v1/admin/${endpoint}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle format response pagination laravel atau standard array
      const result = response.data.data.data
        ? response.data.data.data
        : response.data.data;
      setDataList(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- 4. FETCH MASTER FACILITY (Untuk Form Room) ---
  const fetchMasterFacilities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/admin/resort-facilities`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMasterFacilities(response.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    if (activeTab === "rooms") fetchMasterFacilities();
  }, [activeTab]);

  // --- 5. HANDLE DELETE ---
  const handleDelete = async (id) => {
    // Proteksi: Read-Only tabs tidak boleh hapus
    if (["logs", "reviews", "messages"].includes(activeTab)) return;

    if (!window.confirm("Yakin hapus data ini?")) return;
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/admin/${getEndpoint(activeTab)}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Berhasil dihapus!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus.");
    }
  };

  // --- 6. MODAL LOGIC ---
  const openModal = (item = null) => {
    // Proteksi: Read-Only tabs tidak boleh buka modal
    if (["logs", "reviews", "messages"].includes(activeTab)) return;

    setIsModalOpen(true);
    setSelectedFiles([]);
    setSelectedFacilities([]);

    if (item) {
      setIsEditMode(true);
      // Mapping ID yang beda-beda tiap tabel
      const id =
        item.user_id ||
        item.room_id ||
        item.resort_facility_id ||
        item.promo_id;
      setCurrentId(id);
      setFormData(item);
    } else {
      setIsEditMode(false);
      setFormData({});
      setCurrentId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleFacilityCheck = (e) => {
    const value = e.target.value;
    if (e.target.checked) setSelectedFacilities([...selectedFacilities, value]);
    else
      setSelectedFacilities(
        selectedFacilities.filter((item) => item !== value)
      );
  };

  // --- 7. HANDLE SUBMIT (CREATE/UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = getEndpoint(activeTab);
    const payload = new FormData();

    // Masukkan data text biasa
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && typeof formData[key] !== "object") {
        payload.append(key, formData[key]);
      }
    });

    // Khusus Kamar: Upload File & Fasilitas
    if (activeTab === "rooms") {
      for (let i = 0; i < selectedFiles.length; i++)
        payload.append("photos[]", selectedFiles[i]);
      selectedFacilities.forEach((fac) => payload.append("facilities[]", fac));
    }

    // Trik method PUT dengan FormData di Laravel
    if (isEditMode) payload.append("_method", "PUT");

    const url = isEditMode
      ? `http://localhost:8000/api/v1/admin/${endpoint}/${currentId}`
      : `http://localhost:8000/api/v1/admin/${endpoint}`;

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Data berhasil disimpan!");
      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menyimpan data.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-container">
      {/* HEADER */}
      <div className="header-admin">
        <h1>Admin Panel</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      {/* MENU TABS */}
      <div className="dashboard-icons">
        <div
          className={`icon-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <p>📊 Dashboard</p>
        </div>
        <div
          className={`icon-item ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <p>👥 Users</p>
        </div>
        <div
          className={`icon-item ${activeTab === "rooms" ? "active" : ""}`}
          onClick={() => setActiveTab("rooms")}
        >
          <p>🛏️ Rooms</p>
        </div>
        <div
          className={`icon-item ${activeTab === "facilities" ? "active" : ""}`}
          onClick={() => setActiveTab("facilities")}
        >
          <p>⚙️ Facilities</p>
        </div>
        <div
          className={`icon-item ${activeTab === "promo" ? "active" : ""}`}
          onClick={() => setActiveTab("promo")}
        >
          <p>🏷️ Promo</p>
        </div>
        <div
          className={`icon-item ${activeTab === "messages" ? "active" : ""}`}
          onClick={() => setActiveTab("messages")}
        >
          <p>✉️ Pesan</p>
        </div>
        <div
          className={`icon-item ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          <p>⭐ Reviews</p>
        </div>
        <div
          className={`icon-item ${activeTab === "logs" ? "active" : ""}`}
          onClick={() => setActiveTab("logs")}
        >
          <p>📜 Logs</p>
        </div>
      </div>

      {/* KONTEN UTAMA */}

      {/* 1. TAMPILAN DASHBOARD STATS */}
      {activeTab === "dashboard" && (
        <div className="stats-container">
          <div className="stat-card revenue">
            <h3>Total Pendapatan</h3>
            <p>Rp {parseFloat(stats.total_revenue).toLocaleString("id-ID")}</p>
          </div>
          <div className="stat-card bookings">
            <h3>Booking Bulan Ini</h3>
            <p>{stats.bookings_month} Pesanan</p>
          </div>
          <div className="stat-card users">
            <h3>Total Pelanggan</h3>
            <p>{stats.total_users} User</p>
          </div>
          <div className="stat-card rating">
            <h3>Rating Rata-rata</h3>
            <p>⭐ {stats.avg_rating} / 5</p>
          </div>

          <div className="popular-rooms-section">
            <h3>🏆 Kamar Paling Laris</h3>
            <ul>
              {stats.popular_rooms &&
                stats.popular_rooms.map((room) => (
                  <li key={room.room_id}>
                    <span>{room.name}</span>
                    <strong>{room.bookings_count}x Dipesan</strong>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {/* 2. TAMPILAN TABEL CRUD */}
      {activeTab !== "dashboard" && (
        <div className="content-card">
          <div className="card-header">
            <h3>Management {activeTab.toUpperCase()}</h3>
            {/* Tombol Tambah Hilang di Tab Read-Only */}
            {!["messages", "logs", "reviews"].includes(activeTab) && (
              <button className="btn-add-admin" onClick={() => openModal(null)}>
                + Tambah {activeTab}
              </button>
            )}
          </div>

          {loading ? (
            <p>Loading data...</p>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No</th>
                  {/* Header Sesuai Tab */}
                  {activeTab === "users" && (
                    <>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Aksi</th>
                    </>
                  )}
                  {activeTab === "rooms" && (
                    <>
                      <th>Foto</th>
                      <th>Nama</th>
                      <th>Harga</th>
                      <th>Stok</th>
                      <th>Aksi</th>
                    </>
                  )}
                  {activeTab === "facilities" && (
                    <>
                      <th>Nama</th>
                      <th>Deskripsi</th>
                      <th>Aksi</th>
                    </>
                  )}
                  {activeTab === "promo" && (
                    <>
                      <th>Judul</th>
                      <th>Kode</th>
                      <th>Diskon</th>
                      <th>Aksi</th>
                    </>
                  )}

                  {/* Header Read-Only Tabs */}
                  {activeTab === "messages" && (
                    <>
                      <th>Pengirim</th>
                      <th>Subjek</th>
                      <th>Pesan</th>
                    </>
                  )}
                  {activeTab === "reviews" && (
                    <>
                      <th>User</th>
                      <th>Kamar</th>
                      <th>Rating</th>
                      <th>Komentar</th>
                    </>
                  )}
                  {activeTab === "logs" && (
                    <>
                      <th>User</th>
                      <th>Aksi</th>
                      <th>Deskripsi</th>
                      <th>Waktu</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {dataList.length > 0 ? (
                  dataList.map((item, idx) => {
                    const id =
                      item.user_id ||
                      item.room_id ||
                      item.resort_facility_id ||
                      item.promo_id ||
                      item.message_id ||
                      item.log_id;
                    return (
                      <tr key={id || idx}>
                        <td>{idx + 1}</td>

                        {/* ROW USERS */}
                        {activeTab === "users" && (
                          <>
                            <td>{item.full_name}</td>
                            <td>{item.email}</td>
                            <td>
                              <span className={`badge ${item.role}`}>
                                {item.role}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn-action edit"
                                onClick={() => openModal(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-action delete"
                                onClick={() => handleDelete(id)}
                              >
                                Hapus
                              </button>
                            </td>
                          </>
                        )}

                        {/* ROW ROOMS */}
                        {activeTab === "rooms" && (
                          <>
                            <td>
                              <img
                                src={
                                  item.photos?.[0]?.photo_url ||
                                  "/placeholder.jpg"
                                }
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "5px",
                                }}
                                alt="room"
                              />
                            </td>
                            <td>{item.name}</td>
                            <td>
                              Rp{" "}
                              {parseFloat(item.price_per_night).toLocaleString(
                                "id-ID"
                              )}
                            </td>
                            <td>{item.stock}</td>
                            <td>
                              <button
                                className="btn-action edit"
                                onClick={() => openModal(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-action delete"
                                onClick={() => handleDelete(id)}
                              >
                                Hapus
                              </button>
                            </td>
                          </>
                        )}

                        {/* ROW FACILITIES */}
                        {activeTab === "facilities" && (
                          <>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>
                              <button
                                className="btn-action edit"
                                onClick={() => openModal(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-action delete"
                                onClick={() => handleDelete(id)}
                              >
                                Hapus
                              </button>
                            </td>
                          </>
                        )}

                        {/* ROW PROMO */}
                        {activeTab === "promo" && (
                          <>
                            <td>{item.title}</td>
                            <td>
                              <span
                                style={{
                                  background: "#eee",
                                  padding: "2px 5px",
                                }}
                              >
                                {item.promo_code}
                              </span>
                            </td>
                            <td>{item.discount_percentage}%</td>
                            <td>
                              <button
                                className="btn-action edit"
                                onClick={() => openModal(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-action delete"
                                onClick={() => handleDelete(id)}
                              >
                                Hapus
                              </button>
                            </td>
                          </>
                        )}

                        {/* ROW MESSAGES */}
                        {activeTab === "messages" && (
                          <>
                            <td>
                              {item.sender_name}
                              <br />
                              <small>{item.sender_email}</small>
                            </td>
                            <td>{item.subject}</td>
                            <td>
                              {item.message_body
                                ? item.message_body.substring(0, 50) + "..."
                                : "-"}
                            </td>
                          </>
                        )}

                        {/* ROW REVIEWS */}
                        {activeTab === "reviews" && (
                          <>
                            <td>{item.user?.full_name}</td>
                            <td>{item.booking?.room?.name}</td>
                            <td>⭐ {item.rating}</td>
                            <td>{item.comment}</td>
                          </>
                        )}

                        {/* ROW LOGS */}
                        {activeTab === "logs" && (
                          <>
                            <td>
                              {item.user ? item.user.full_name : "Sistem"}
                            </td>
                            <td>
                              <span className="badge-log">{item.action}</span>
                            </td>
                            <td>{item.description}</td>
                            <td style={{ fontSize: "0.8rem" }}>
                              {new Date(item.created_at).toLocaleString()}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Tidak ada data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 3. MODAL FORM POPUP */}
      {isModalOpen && !["messages", "logs", "reviews"].includes(activeTab) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditMode ? "Edit Data" : "Tambah Data"}</h2>
            <form onSubmit={handleSubmit}>
              {/* FORM USERS */}
              {activeTab === "users" && (
                <>
                  <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input
                      name="full_name"
                      value={formData.full_name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {!isEditMode && (
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      name="role"
                      value={formData.role || "pelanggan"}
                      onChange={handleInputChange}
                    >
                      <option value="pelanggan">Pelanggan</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              )}

              {/* FORM ROOMS */}
              {activeTab === "rooms" && (
                <>
                  <div className="form-group">
                    <label>Nama Kamar</label>
                    <input
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div
                    className="form-row"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Harga</label>
                      <input
                        type="number"
                        name="price_per_night"
                        value={formData.price_per_night || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Stok</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Kapasitas</label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div
                    className="form-group"
                    style={{
                      background: "#f9f9f9",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <label>Upload Foto</label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                  <div className="form-group">
                    <label>Fasilitas:</label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: "5px",
                      }}
                    >
                      {masterFacilities.length > 0 ? (
                        masterFacilities.map((fac) => (
                          <label
                            key={fac.resort_facility_id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              background: "#eee",
                              padding: "5px 10px",
                              borderRadius: "15px",
                              fontSize: "0.8rem",
                            }}
                          >
                            <input
                              type="checkbox"
                              value={fac.name}
                              onChange={handleFacilityCheck}
                              style={{ marginRight: "5px", width: "auto" }}
                            />
                            {fac.name}
                          </label>
                        ))
                      ) : (
                        <p style={{ fontSize: "0.8rem", color: "red" }}>
                          Data Fasilitas kosong.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </>
              )}

              {/* FORM PROMO */}
              {activeTab === "promo" && (
                <>
                  <div className="form-group">
                    <label>Judul</label>
                    <input
                      name="title"
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div
                    className="form-row"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <div className="form-group" style={{ flex: 2 }}>
                      <label>Kode</label>
                      <input
                        name="promo_code"
                        value={formData.promo_code || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Diskon (%)</label>
                      <input
                        type="number"
                        name="discount_percentage"
                        value={formData.discount_percentage || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div
                    className="form-row"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Mulai</label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Selesai</label>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </>
              )}

              {/* FORM FACILITIES (RESORT) */}
              {activeTab === "facilities" && (
                <>
                  <div className="form-group">
                    <label>Nama Fasilitas</label>
                    <input
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-cancel"
                >
                  Batal
                </button>
                <button type="submit" className="btn-save">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
