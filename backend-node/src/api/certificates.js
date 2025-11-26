import express from "express";
import {
  getCertificateController,
  certificatesOfOwnerController,
  purchaseCertificateController,
  retireCertificateController,
  getAllCertificatesController,
} from "../controllers/certificates.controller.js";

const router = express.Router();

router.get("/all", getAllCertificatesController);
router.get("/:id", getCertificateController);
router.get("/owner/:address", certificatesOfOwnerController);
router.post("/purchase", purchaseCertificateController);
router.post("/retire", retireCertificateController);

export default router;
