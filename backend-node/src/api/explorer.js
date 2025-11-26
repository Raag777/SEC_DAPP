// backend-node/src/api/explorer.js
import express from "express";
import {
  getBlockDetailsController,
  getLatestBlockNumberController,
  getBlockRangeController,
  getTransactionDetailsController,
} from "../controllers/blockchain-explorer.controller.js";

const router = express.Router();

// Get latest block number
router.get("/latest-block", getLatestBlockNumberController);

// Get block details
router.get("/block/:blockNumber", getBlockDetailsController);

// Get block range
router.get("/blocks", getBlockRangeController);

// Get transaction details
router.get("/transaction/:txHash", getTransactionDetailsController);

export default router;
