import { registerProducerService, removeProducerService } from "../services/admin.service.js";

export const registerProducerController = async (req, res) => {
    try {
        const { address } = req.body;
        const result = await registerProducerService(address);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const removeProducerController = async (req, res) => {
    try {
        const { address } = req.body;
        const result = await removeProducerService(address);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
