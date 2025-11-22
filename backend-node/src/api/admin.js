import express from "express";
import {
    registerProducerController,
    removeProducerController,
    registerCompanyController,
    removeCompanyController,
    listProducersController,
    listCompaniesController,
    setMinEnergyController,
    setDefaultPriceController
} from "../controllers/admin.controller.js";

const router = express.Router();

// ------- LISTS -------
router.get("/producers", listProducersController);
router.get("/companies", listCompaniesController);

// ------- PRODUCER -------
router.post("/registerProducer", registerProducerController);
router.post("/removeProducer", removeProducerController);

// ------- COMPANY -------
router.post("/registerCompany", registerCompanyController);
router.post("/removeCompany", removeCompanyController);

// ------- POLICY -------
router.post("/setMinEnergy", setMinEnergyController);
router.post("/setDefaultPrice", setDefaultPriceController);

export default router;
