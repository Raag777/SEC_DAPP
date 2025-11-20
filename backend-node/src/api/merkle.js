import express from "express";
import { getMerkleTree } from "../services/merkleService.js";

const router = express.Router();

router.get("/root", (req, res) => {
    const { root } = getMerkleTree();
    res.json({ root });
});

router.get("/full", (req, res) => {
    const treeData = getMerkleTree();
    res.json(treeData);
});

export default router;
