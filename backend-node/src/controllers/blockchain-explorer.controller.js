// backend-node/src/controllers/blockchain-explorer.controller.js
import {
  getBlockDetailsService,
  getLatestBlockNumberService,
  getBlockRangeService,
  getTransactionDetailsService,
} from "../services/blockchain-explorer.service.js";

export const getBlockDetailsController = async (req, res) => {
  try {
    const { blockNumber } = req.params;
    if (!blockNumber) {
      return res.status(400).json({ error: "Block number is required" });
    }
    const result = await getBlockDetailsService(Number(blockNumber));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLatestBlockNumberController = async (req, res) => {
  try {
    const result = await getLatestBlockNumberService();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlockRangeController = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: "from and to query params are required" });
    }
    const result = await getBlockRangeService(Number(from), Number(to));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTransactionDetailsController = async (req, res) => {
  try {
    const { txHash } = req.params;
    if (!txHash) {
      return res.status(400).json({ error: "Transaction hash is required" });
    }
    const result = await getTransactionDetailsService(txHash);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
