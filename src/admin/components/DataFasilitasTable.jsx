// File: src/admin/components/DataFasilitasTable.jsx
// Ini adalah tabel untuk "Data Fasilitas"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../AdminDashboard.css";

const DataFasilitasTable = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        // (Sesuai api.php Anda)
        const response = await axios.get(
          "http://localhost:8000/api/v1/admin/resort-facilities"
        );
        setFacilities(response.data.data);
      } catch (err) {
        setError("Gagal memuat data fasilitas.");
        console.error("Gagal fetch data fasilitas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  return (
    <div className="content">
      <div className="content-header">
        <div className="content-header-left">
          <h2>Data Fasilitas</h2>
        </div>
        {/* ... (Filter/Search) ... */}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nama Fasilitas</th>
              <th>Tipe</th>
              <th>Icon</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="4">Loading data fasilitas...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="4" style={{ color: "red" }}>
                  {error}
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              facilities.map((facility) => (
                <tr key={facility.facility_id}>
                  {" "}
                  {/* (Asumsi key) */}
                  <td>{facility.name}</td>
                  <td>{facility.type}</td>
                  <td>{facility.icon_url || "N/A"}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(
                          `/admin/edit-fasilitas/${facility.facility_id}`
                        )
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && !error && facilities.length === 0 && (
              <tr>
                <td colSpan="4">Tidak ada data fasilitas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="content-footer">
        <button
          className="add-btn"
          onClick={() => navigate("/admin/add-fasilitas")}
        >
          + Add Fasilitas
        </button>
      </div>
    </div>
  );
};

export default DataFasilitasTable;
