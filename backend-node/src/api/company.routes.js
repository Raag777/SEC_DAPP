import express from "express";
import {
    registerCompanyController,
    removeCompanyController,
    listCompaniesController,
    isCompanyController
} from "../controllers/company.controller.js";

const router = express.Router();

// Register company
router.post("/register", registerCompanyController);

// Remove company
router.post("/remove", removeCompanyController);

// Get list of registered companies
router.get("/list", listCompaniesController);

// Check if address is a company
router.get("/is-company/:address", isCompanyController);

export default router;
