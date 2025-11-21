import { issueCertificateService, setProducerPriceService } from "../services/producer.service.js";

export const issueCertificateController = async (req, res) => {
    try {
        const { address, energyWh } = req.body;
        const result = await issueCertificateService(address, energyWh);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const setProducerPriceController = async (req, res) => {
    try {
        const { priceWei } = req.body;
        const result = await setProducerPriceService(priceWei);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
