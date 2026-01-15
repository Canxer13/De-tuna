import axios from "axios";

// Ambil URL dari .env, kalau tidak ada pakai localhost (untuk jaga-jaga)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*", // Opsional
  },
});

export default api;
