// File: src/admin/components/DataPromoTable.jsx
// Ini adalah tabel untuk "Data Promo"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../AdminDashboard.css"; // Pakai CSS yang sama

const DataPromoTable = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/admin/promotions"
        );
        // Sesuaikan .data.data jika struktur API Anda berbeda
        setPromotions(response.data.data);
      } catch (err) {
        setError("Gagal memuat data promosi.");
        console.error("Gagal fetch data promosi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  return (
    <div className="content">
      <div className="content-header">
        <div className="content-header-left">
          <h2>Data Promo</h2>
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

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Judul</th>
              <th>Kode Promo</th>
              <th>Potongan (%)</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5">Loading data promosi...</td>
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
              promotions.map((promo) => (
                <tr key={promo.promotion_id}>
                  {" "}
                  {/* (Asumsi key adalah promotion_id) */}
                  <td>{promo.title}</td>
                  <td>{promo.promo_code}</td>
                  <td>{promo.discount_percentage}</td>
                  <td>{promo.status}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={
                        () =>
                          navigate(`/admin/view-promo/${promo.promotion_id}`) // (Buat rute ini di App.jsx nanti)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && !error && promotions.length === 0 && (
              <tr>
                <td colSpan="5">Tidak ada data promosi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="content-footer">
        <button className="add-btn">+ Add Promo</button>
      </div>
    </div>
  );
};

export default DataPromoTable;
