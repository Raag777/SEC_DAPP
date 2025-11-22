// backend-node/src/controllers/producer.controller.js
import {
  setProducerPriceService,
  issueCertificateService,
  myCertificatesService,
} from "../services/producer.service.js";

export const setProducerPriceController = async (req, res) => {
  try {
    const { priceWei } = req.body;
    const out = await setProducerPriceService(req.body.address, priceWei);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const issueCertificateController = async (req, res) => {
  try {
    const { owner, energyWh } = req.body;
    const out = await issueCertificateService(owner, Number(energyWh));
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const myCertificatesController = async (req, res) => {
  try {
    const { owner } = req.query;
    const out = await myCertificatesService(owner);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
