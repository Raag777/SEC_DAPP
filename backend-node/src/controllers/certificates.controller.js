// backend-node/src/controllers/certificate.controller.js
import {
  getCertificateService,
  certificatesOfOwnerService,
  purchaseCertificateService,
  retireCertificateService,
} from "../services/certificates.service.js";

export const getCertificateController = async (req, res) => {
  try {
    const { id } = req.params;
    const out = await getCertificateService(id);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const certificatesOfOwnerController = async (req, res) => {
  try {
    const { owner } = req.query;
    const out = await certificatesOfOwnerService(owner);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const purchaseCertificateController = async (req, res) => {
  try {
    const { id, valueWei } = req.body;
    const out = await purchaseCertificateService(id, valueWei);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const retireCertificateController = async (req, res) => {
  try {
    const { id } = req.body;
    const out = await retireCertificateService(id);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
