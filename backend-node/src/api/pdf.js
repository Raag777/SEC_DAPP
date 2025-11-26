// backend-node/src/api/pdf.js
import express from "express";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { ethers } from "ethers";
import solarABI from "../abi/SolarEnergyCertificate.json" with { type: "json" };

const router = express.Router();

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
const EXPLORER_URL = process.env.EXPLORER_URL || ""; 
// Example: http://localhost:8545/block/   (optional)

if (!CONTRACT_ADDRESS) {
  console.warn("WARNING: CONTRACT_ADDRESS missing — PDF generator will fail.");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, solarABI, provider);

/** Convert Base64 DataURL → Buffer */
function dataURLtoBuffer(dataURL) {
  const matches = dataURL.match(/^data:.+;base64,(.*)$/);
  return Buffer.from(matches[1], "base64");
}

router.get("/download_certificate/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id || id <= 0) return res.status(400).json({ error: "Invalid ID" });

  try {
    // ----------------------------
    // 1) GET CERTIFICATE INFO
    // ----------------------------
    const c = await contract.getCertificate(id);
    const cert = {
      id: Number(c[0]),
      owner: c[1],
      energyWh: Number(c[2]),
      timestamp: Number(c[3]),
      retired: Boolean(c[4]),
      issuer: c[5],
      priceWei: String(c[6]),
    };

    // ----------------------------
    // 2) GET PRODUCERS AND COMPANIES LISTS
    // ----------------------------
    const producers = await contract.getProducers();
    const companies = await contract.getCompanies();

    // Determine certificate label (P1_ID1 or C1_ID1)
    let certLabel = `ID${cert.id}`;
    let ownerType = "Unknown";
    let ownerIndex = -1;

    // Check if owner is a producer
    const producerIndex = producers.findIndex(p => p.toLowerCase() === cert.owner.toLowerCase());
    if (producerIndex !== -1) {
      ownerType = "Producer";
      ownerIndex = producerIndex + 1;
      certLabel = `P${ownerIndex}_ID${cert.id}`;
    } else {
      // Check if owner is a company
      const companyIndex = companies.findIndex(c => c.toLowerCase() === cert.owner.toLowerCase());
      if (companyIndex !== -1) {
        ownerType = "Company";
        ownerIndex = companyIndex + 1;
        certLabel = `C${ownerIndex}_ID${cert.id}`;
      }
    }

    // Also check issuer type
    let issuerLabel = cert.issuer;
    const issuerProducerIndex = producers.findIndex(p => p.toLowerCase() === cert.issuer.toLowerCase());
    if (issuerProducerIndex !== -1) {
      issuerLabel = `P${issuerProducerIndex + 1} (${cert.issuer})`;
    }

    // ----------------------------
    // 3) GET TRANSACTION HASH (lookup CertificateIssued event)
    // ----------------------------
    const filter = contract.filters.CertificateIssued(cert.id, null, null, null, null);
    const events = await contract.queryFilter(filter, 0, "latest");

    let txHash = "NOT FOUND";
    let blockNumber = "N/A";
    if (events.length > 0) {
      txHash = events[0].transactionHash;
      blockNumber = events[0].blockNumber;
    }

    // ----------------------------
    // 4) Generate QR code → frontend certificate viewer
    // ----------------------------
    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyURL = `${frontend}/certificate/${cert.id}`;

    const qrDataUrl = await QRCode.toDataURL(verifyURL, {
      margin: 1,
      width: 200,
    });
    const qrBuffer = dataURLtoBuffer(qrDataUrl);

    // PDF setup
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-disposition", `attachment; filename=SEC_${certLabel}.pdf`);
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    // ----------------------------
    // HEADER WITH DECORATIVE BORDER
    // ----------------------------
    doc
      .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
      .lineWidth(3)
      .strokeColor("#f59e0b")
      .stroke();

    doc
      .rect(45, 45, doc.page.width - 90, doc.page.height - 90)
      .lineWidth(1)
      .strokeColor("#22c55e")
      .stroke();

    // Title
    doc
      .font("Helvetica-Bold")
      .fontSize(28)
      .fillColor("#f59e0b")
      .text("☀️  SOLAR ENERGY CERTIFICATE", 60, 80, { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .fillColor("#64748b")
      .text("Blockchain-Verified Renewable Energy Credential", { align: "center" })
      .moveDown(2);

    // ----------------------------
    // CERTIFICATE DETAILS BOX
    // ----------------------------
    const boxTop = doc.y;

    doc
      .rect(70, boxTop, doc.page.width - 140, 220)
      .fillColor("#f0fdf4")
      .fillAndStroke("#22c55e", "#22c55e")
      .lineWidth(1);

    // Certificate Information
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#15803d")
      .text(`Certificate ID: ${certLabel}`, 90, boxTop + 20)
      .moveDown(1);

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#0f172a")
      .text(`Owner Type: ${ownerType}`, 90)
      .text(`Owner Address: ${cert.owner}`, 90)
      .moveDown(0.5)
      .text(`Issuer (Producer): ${issuerLabel}`, 90)
      .moveDown(0.5)
      .text(`Energy Produced: ${(cert.energyWh / 1000).toFixed(3)} kWh (${cert.energyWh} Wh)`, 90)
      .moveDown(0.5)
      .text(`Issued On: ${new Date(cert.timestamp * 1000).toUTCString()}`, 90)
      .moveDown(0.5)
      .text(`Certificate Price: ${ethers.formatEther(cert.priceWei)} ETH`, 90)
      .moveDown(0.5);

    // Status
    const statusText = cert.retired ? "RETIRED ❌" : "ACTIVE ✅";
    const statusColor = cert.retired ? "#dc2626" : "#16a34a";
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(statusColor)
      .text(`Status: ${statusText}`, 90);

    doc.moveDown(2);

    // ----------------------------
    // BLOCKCHAIN VERIFICATION
    // ----------------------------
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#0369a1")
      .text("🔗 Blockchain Verification", 70)
      .moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#334155")
      .text(`Transaction Hash: ${txHash}`, 70)
      .text(`Block Number: ${blockNumber}`, 70)
      .text(`Smart Contract: ${CONTRACT_ADDRESS}`, 70)
      .moveDown(1.5);

    // ----------------------------
    // QR CODE
    // ----------------------------
    const qrX = doc.page.width - 180;
    const qrY = doc.page.height - 250;

    doc.image(qrBuffer, qrX, qrY, { width: 130 });

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#0f172a")
      .text("Scan to Verify", qrX, qrY - 20, { width: 130, align: "center" });

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#0369a1")
      .text(verifyURL, qrX - 40, qrY + 140, { width: 210, align: "center", link: verifyURL });

    // ----------------------------
    // SIGNATURE & AUTHORIZATION
    // ----------------------------
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#0f172a")
      .text("Authorized Signature:", 70, doc.page.height - 150)
      .moveDown(0.5);

    doc
      .moveTo(70, doc.page.height - 120)
      .lineTo(270, doc.page.height - 120)
      .stroke("#0f172a");

    // ----------------------------
    // FOOTER
    // ----------------------------
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#64748b")
      .text("Verified on Blockchain via SEC DApp © 2025", 70, doc.page.height - 90, { align: "center", width: doc.page.width - 140 })
      .fontSize(7)
      .text(`Generated: ${new Date().toISOString()}`, { align: "center" });

    doc.end();
  } catch (err) {
    console.error("PDF ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
