import express from "express";
import contract from "../services/blockchain.js";

const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        const { address } = req.body;
        const tx = await contract.addAdmin(address);
        res.json({ tx: tx.hash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
