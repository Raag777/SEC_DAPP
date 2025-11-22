// frontend-vite/src/api/axiosClient.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export default axiosClient;
