// frontend-vite/src/api/metrics.js
import axios from "./axiosClient";

export const recordLatency = async (txHash, submittedAt) => {
  const response = await axios.post("/metrics/latency", { txHash, submittedAt });
  return response.data;
};

export const getAllMetrics = async () => {
  const response = await axios.get("/metrics/all");
  return response.data;
};

export const getThroughput = async () => {
  const response = await axios.get("/metrics/throughput");
  return response.data;
};

export const getLatencyStats = async () => {
  const response = await axios.get("/metrics/latency-stats");
  return response.data;
};

export const getBlockchainAnalytics = async () => {
  const response = await axios.get("/metrics/analytics");
  return response.data;
};
