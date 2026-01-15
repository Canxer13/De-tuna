// File: src/admin/components/DataTamuTable.jsx
// Ini adalah tabel untuk "Data Tamu"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../AdminDashboard.css";

const DataTamuTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // (Sesuai api.php Anda - Ini adalah rute Super Admin)
        const response = await axios.get(
          "http://localhost:8000/api/v1/superadmin/users"
        );
        setUsers(response.data.data);
      } catch (err) {
        setError("Gagal memuat data tamu/user.");
        console.error("Gagal fetch data tamu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="content">
      <div className="content-header">
        <div className="content-header-left">
          <h2>Data Tamu (Users)</h2>
        </div>
        {/* ... (Filter/Search) ... */}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nama Lengkap</th>
              <th>Email</th>
              <th>No. Telepon</th>
              <th>Role</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5">Loading data tamu...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="5" style={{ color: "red" }}>
                  {error}
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="view-btn">Edit</button>
                  </td>
                </tr>
              ))}
            {!loading && !error && users.length === 0 && (
              <tr>
                <td colSpan="5">Tidak ada data tamu.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="content-footer">
        <button className="add-btn">+ Add Admin</button>
      </div>
    </div>
  );
};

export default DataTamuTable;
