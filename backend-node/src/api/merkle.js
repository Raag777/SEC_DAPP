// backend-node/src/api/merkle.js
import express from "express";
import { buildMerkleTree } from "../services/merkleService.js";
const router = express.Router();

router.get("/merkle", async (req, res) => {
  try {
    const from = req.query.from ? Number(req.query.from) : 0;
    const to = req.query.to || "latest";
    const result = await buildMerkleTree(from, to);
    res.json(result);
  } catch (e) {
    console.error("merkle error", e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
