import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Import API routes ---
import adminRoutes from "./api/admin.js";
import producerRoutes from "./api/producers.js";
import companyRoutes from "./api/companies.js";
import certificateRoutes from "./api/certificates.js";
import merkleRoutes from "./api/merkle.js";

// --- Attach routes ---
app.use("/admin", adminRoutes);
app.use("/producers", producerRoutes);
app.use("/companies", companyRoutes);
app.use("/certificates", certificateRoutes);
app.use("/merkle", merkleRoutes);

app.get("/", (req, res) => {
    res.send("SEC Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
