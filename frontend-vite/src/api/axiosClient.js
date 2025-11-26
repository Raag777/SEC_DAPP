// frontend-vite/src/api/axiosClient.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: API_BASE,
  timeout: 0,
});

export default axiosClient;
