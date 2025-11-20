import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional logging
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data || err.message);
    throw err;
  }
);

export default axiosClient;
