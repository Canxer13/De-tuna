import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileSetting.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfileSetting = () => {
  const [user, setUser] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    profile_picture: null,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Data Profil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${BASE_URL}/api/v1/me/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data.data;
        setUser({
          full_name: userData.full_name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          profile_picture: userData.profile_picture,
        });
      } catch (err) {
        console.error("Gagal load profile", err);
      }
    };
    fetchProfile();
  }, []);

  // 2. Handle Input Teks
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 3. Handle Pilih Foto
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 4. Handle Simpan (Upload)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("authToken");
    const formData = new FormData();

    formData.append("full_name", user.full_name);
    formData.append("phone_number", user.phone_number);

    if (selectedFile) {
      formData.append("profile_picture", selectedFile);
    }

    try {
      // HAPUS "const response =" KARENA TIDAK DIPAKAI
      await axios.post(`${BASE_URL}/api/v1/me/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profil berhasil diperbarui!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(
        "Gagal update profil: " +
          (err.response?.data?.message || "Server Error")
      );
      setLoading(false); // Matikan loading jika error
    }
    // Note: Jika sukses, tidak perlu setLoading(false) karena halaman akan reload
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Pengaturan Profil</h2>

        {/* AREA FOTO PROFIL */}
        <div className="profile-picture-section">
          <div className="image-wrapper">
            {/* Logic Preview: Prioritaskan Preview Lokal -> Lalu Foto DB -> Terakhir Placeholder */}
            <img
              src={
                previewImage ||
                user.profile_picture ||
                "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="profile-img"
            />
          </div>
          <label className="upload-btn">
            Ganti Foto
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              name="full_name"
              value={user.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email (Tidak bisa diubah)</label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              className="input-disabled"
            />
          </div>

          <div className="form-group">
            <label>No. Telepon</label>
            <input
              type="text"
              name="phone_number"
              value={user.phone_number}
              onChange={handleChange}
              placeholder="08123456789"
            />
          </div>

          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetting;
