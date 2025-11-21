import { issueCertificateService, purchaseCertificateService, retireCertificateService } from "../services/certificates.service.js";

export const issueCertificateController = async (req, res) => {
    try {
        const { address, energyWh } = req.body;
        const result = await issueCertificateService(address, energyWh);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const purchaseCertificateController = async (req, res) => {
    try {
        const { id, priceWei } = req.body;
        const result = await purchaseCertificateService(id, priceWei);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const retireCertificateController = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await retireCertificateService(id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
