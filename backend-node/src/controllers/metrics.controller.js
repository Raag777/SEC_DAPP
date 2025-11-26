// backend-node/src/controllers/metrics.controller.js
import {
  calculateLatencyService,
  getMetricsService,
  getThroughputService,
  getLatencyStatsService,
  getBlockchainAnalyticsService,
} from "../services/metrics.service.js";

export const calculateLatencyController = async (req, res) => {
  try {
    const { txHash, submittedAt } = req.body;
    if (!txHash || !submittedAt) {
      return res.status(400).json({ error: "txHash and submittedAt are required" });
    }
    const result = await calculateLatencyService(txHash, Number(submittedAt));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMetricsController = async (req, res) => {
  try {
    const result = await getMetricsService();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getThroughputController = async (req, res) => {
  try {
    const result = await getThroughputService();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLatencyStatsController = async (req, res) => {
  try {
    const result = await getLatencyStatsService();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlockchainAnalyticsController = async (req, res) => {
  try {
    const result = await getBlockchainAnalyticsService();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
