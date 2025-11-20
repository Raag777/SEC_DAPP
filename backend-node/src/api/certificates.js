import express from "express";
import contract from "../services/blockchain.js";
import keccak256 from "keccak256";
import { loadCertificates, saveCertificates } from "../services/certificateStore.js";

const router = express.Router();

// Producer issues certificate
router.post("/mint", async (req, res) => {
    try {
        const { owner, energy } = req.body;

        const tx = await contract.issueCertificate(owner, energy);
        const receipt = await tx.wait();

        const certId = await contract.getNextId() - 1;

        const leaf = `P_${owner}_ID${certId}`;

        const store = loadCertificates();
        store.push({ certId, leaf });
        saveCertificates(store);

        res.json({
            txHash: receipt.transactionHash,
            certId,
            leaf
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Company purchases SEC
router.post("/purchase", async (req, res) => {
    try {
        const { certId } = req.body;

        const tx = await contract.purchaseCertificate(certId);
        const receipt = await tx.wait();

        const store = loadCertificates();
        store.push({ certId, leaf: `C_PURCHASE_ID${certId}` });
        saveCertificates(store);

        res.json({
            txHash: receipt.transactionHash,
            status: "purchased"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
