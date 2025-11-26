// backend-node/src/api/metrics.js
import express from "express";
import {
  calculateLatencyController,
  getMetricsController,
  getThroughputController,
  getLatencyStatsController,
  getBlockchainAnalyticsController,
} from "../controllers/metrics.controller.js";

const router = express.Router();

// Record latency for a transaction
router.post("/latency", calculateLatencyController);

// Get all metrics
router.get("/all", getMetricsController);

// Get throughput metrics
router.get("/throughput", getThroughputController);

// Get latency statistics
router.get("/latency-stats", getLatencyStatsController);

// Get blockchain analytics
router.get("/analytics", getBlockchainAnalyticsController);

export default router;
