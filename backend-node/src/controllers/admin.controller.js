import {
    registerProducerService,
    removeProducerService,
    registerCompanyService,
    removeCompanyService,
    listProducersService,
    listCompaniesService,
    setMinEnergyService,
    setDefaultPriceService
} from "../services/admin.service.js";

// ------- LISTS -------
export const listProducersController = async (_req, res) => {
    try {
        const data = await listProducersService();
        res.json({ producers: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const listCompaniesController = async (_req, res) => {
    try {
        const data = await listCompaniesService();
        res.json({ companies: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ------- PRODUCER -------
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

// ------- COMPANY -------
export const registerCompanyController = async (req, res) => {
    try {
        const { address } = req.body;
        const result = await registerCompanyService(address);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const removeCompanyController = async (req, res) => {
    try {
        const { address } = req.body;
        const result = await removeCompanyService(address);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ------- POLICY -------
export const setMinEnergyController = async (req, res) => {
    try {
        const { minEnergy } = req.body;
        const result = await setMinEnergyService(minEnergy);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const setDefaultPriceController = async (req, res) => {
    try {
        const { defaultPriceWei } = req.body;
        const result = await setDefaultPriceService(defaultPriceWei);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
