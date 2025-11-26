// backend-node/src/services/metrics.service.js
import { provider, contractRO } from "./blockchain.js";

// In-memory storage for metrics (for production, use a database)
const transactionMetrics = [];

/**
 * Record a transaction metric
 */
export const recordTransactionMetric = (metric) => {
  transactionMetrics.push({
    ...metric,
    recordedAt: Date.now(),
  });
};

/**
 * Calculate latency for a transaction (submission to confirmation)
 */
export const calculateLatencyService = async (txHash, submittedAt) => {
  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt) {
    throw new Error("Transaction not confirmed yet");
  }

  const block = await provider.getBlock(receipt.blockNumber);
  const confirmedAt = block.timestamp * 1000; // Convert to milliseconds
  const latencyMs = confirmedAt - submittedAt;

  const metric = {
    txHash,
    submittedAt,
    confirmedAt,
    latencyMs,
    blockNumber: receipt.blockNumber,
  };

  recordTransactionMetric(metric);
  return metric;
};

/**
 * Get all transaction metrics
 */
export const getMetricsService = async () => {
  return {
    totalTransactions: transactionMetrics.length,
    metrics: transactionMetrics,
  };
};

/**
 * Calculate throughput metrics
 */
export const getThroughputService = async () => {
  const latestBlockNumber = await provider.getBlockNumber();

  // Get last 100 blocks for throughput calculation
  const startBlock = Math.max(0, latestBlockNumber - 99);
  const blocks = [];
  let totalTransactions = 0;

  for (let i = startBlock; i <= latestBlockNumber; i++) {
    const block = await provider.getBlock(i, false);
    if (block) {
      blocks.push({
        number: block.number,
        timestamp: block.timestamp,
        transactionCount: block.transactions?.length || 0,
      });
      totalTransactions += block.transactions?.length || 0;
    }
  }

  // Calculate time span
  const timeSpanSeconds = blocks.length > 1
    ? blocks[blocks.length - 1].timestamp - blocks[0].timestamp
    : 1;

  const tps = timeSpanSeconds > 0 ? totalTransactions / timeSpanSeconds : 0;

  // Calculate average block time
  const blockTimes = [];
  for (let i = 1; i < blocks.length; i++) {
    blockTimes.push(blocks[i].timestamp - blocks[i - 1].timestamp);
  }
  const avgBlockTime = blockTimes.length > 0
    ? blockTimes.reduce((a, b) => a + b, 0) / blockTimes.length
    : 0;

  return {
    totalBlocks: blocks.length,
    totalTransactions,
    timeSpanSeconds,
    transactionsPerSecond: parseFloat(tps.toFixed(4)),
    averageBlockTime: parseFloat(avgBlockTime.toFixed(2)),
    blocks: blocks.slice(-20), // Return last 20 blocks
  };
};

/**
 * Get latency statistics
 */
export const getLatencyStatsService = async () => {
  if (transactionMetrics.length === 0) {
    return {
      count: 0,
      averageLatencyMs: 0,
      minLatencyMs: 0,
      maxLatencyMs: 0,
      metrics: [],
    };
  }

  const latencies = transactionMetrics.map((m) => m.latencyMs);
  const sum = latencies.reduce((a, b) => a + b, 0);
  const avg = sum / latencies.length;
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);

  return {
    count: transactionMetrics.length,
    averageLatencyMs: parseFloat(avg.toFixed(2)),
    minLatencyMs: min,
    maxLatencyMs: max,
    metrics: transactionMetrics.slice(-50), // Return last 50
  };
};

/**
 * Get blockchain analytics
 */
export const getBlockchainAnalyticsService = async () => {
  const latestBlockNumber = await provider.getBlockNumber();

  // Certificate-specific analytics
  const nextId = await contractRO.nextId();
  const totalCertificates = Number(nextId) - 1;

  // Get event counts (last 1000 blocks)
  const fromBlock = Math.max(0, latestBlockNumber - 1000);

  const issuedFilter = contractRO.filters.CertificateIssued();
  const purchasedFilter = contractRO.filters.CertificatePurchased();
  const retiredFilter = contractRO.filters.CertificateRetired();

  const [issuedEvents, purchasedEvents, retiredEvents] = await Promise.all([
    contractRO.queryFilter(issuedFilter, fromBlock, latestBlockNumber),
    contractRO.queryFilter(purchasedFilter, fromBlock, latestBlockNumber),
    contractRO.queryFilter(retiredFilter, fromBlock, latestBlockNumber),
  ]);

  return {
    currentBlockNumber: latestBlockNumber,
    totalCertificates,
    recentActivity: {
      blocksAnalyzed: latestBlockNumber - fromBlock + 1,
      certificatesIssued: issuedEvents.length,
      certificatesPurchased: purchasedEvents.length,
      certificatesRetired: retiredEvents.length,
    },
  };
};
