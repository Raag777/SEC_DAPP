// backend-node/src/controllers/certificates.controller.js
import {
  getCertificateService,
  certificatesOfOwnerService,
  purchaseCertificateService,
  retireCertificateService,
  getAllCertificatesService,
} from "../services/certificates.service.js";

export const getCertificateController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Certificate ID is required" });
    }
    const out = await getCertificateService(id);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const certificatesOfOwnerController = async (req, res) => {
  try {
    const { address } = req.params;
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }
    const out = await certificatesOfOwnerService(address);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const purchaseCertificateController = async (req, res) => {
  try {
    const { id, valueWei, companyAddress } = req.body;
    if (!id || !valueWei) {
      return res.status(400).json({ error: "Certificate ID and valueWei are required" });
    }
    if (!companyAddress) {
      return res.status(400).json({ error: "Company address is required" });
    }
    const out = await purchaseCertificateService(id, valueWei, companyAddress);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const retireCertificateController = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Certificate ID is required" });
    }
    const out = await retireCertificateService(id);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllCertificatesController = async (req, res) => {
  try {
    const out = await getAllCertificatesService();
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
