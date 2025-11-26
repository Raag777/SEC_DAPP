import {
    registerCompanyService,
    removeCompanyService,
    listCompaniesService,
    isCompanyService
} from "../services/company.service.js";

export const registerCompanyController = async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ error: "Address is required" });
        }
        const result = await registerCompanyService(address);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const removeCompanyController = async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ error: "Address is required" });
        }
        const result = await removeCompanyService(address);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const listCompaniesController = async (_req, res) => {
    try {
        const result = await listCompaniesService();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const isCompanyController = async (req, res) => {
    try {
        const { address } = req.params;
        if (!address) {
            return res.status(400).json({ error: "Address is required" });
        }
        const result = await isCompanyService(address);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
