import express from "express";
import {
  setProducerPriceController,
  issueCertificateController,
  myCertificatesController,
} from "../controllers/producer.controller.js";

const router = express.Router();

router.post("/setPrice", setProducerPriceController);
router.post("/issue", issueCertificateController);
router.get("/myCertificates", myCertificatesController);

export default router;
