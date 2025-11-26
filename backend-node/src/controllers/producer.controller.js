// backend-node/src/controllers/producer.controller.js
import {
  setProducerPriceService,
  issueCertificateService,
  myCertificatesService,
} from "../services/producer.service.js";

export const setProducerPriceController = async (req, res) => {
  try {
    const { priceWei, address } = req.body;
    if (priceWei === undefined || priceWei === null || !address) {
      return res.status(400).json({ error: "Address and priceWei are required" });
    }
    const out = await setProducerPriceService(address, priceWei);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const issueCertificateController = async (req, res) => {
  try {
    const { owner, energyWh, producerAddress } = req.body;
    if (!owner || !energyWh) {
      return res.status(400).json({ error: "Owner address and energyWh are required" });
    }
    if (!producerAddress) {
      return res.status(400).json({ error: "Producer address is required" });
    }
    const out = await issueCertificateService(owner, Number(energyWh), producerAddress);
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
