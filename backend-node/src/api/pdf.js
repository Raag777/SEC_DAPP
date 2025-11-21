// backend-node/src/api/pdf.js
import express from "express";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { ethers } from "ethers";
import solarAbi from "../abi/SolarEnergyCertificate.json";

const router = express.Router();

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
const EXPLORER_URL = process.env.EXPLORER_URL || ""; 
// Example: http://localhost:8545/block/   (optional)

if (!CONTRACT_ADDRESS) {
  console.warn("WARNING: CONTRACT_ADDRESS missing — PDF generator will fail.");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, solarAbi, provider);

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
    // 2) GET TRANSACTION HASH (lookup CertificateIssued event)
    // ----------------------------
    const filter = contract.filters.CertificateIssued(cert.id, null, null, null, null);
    const events = await contract.queryFilter(filter, 0, "latest");

    let txHash = "NOT FOUND";
    if (events.length > 0) {
      txHash = events[0].transactionHash;
    }

    // ----------------------------
    // 3) Generate QR code → frontend certificate viewer
    // ----------------------------
    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyURL = `${frontend}/certificate/${cert.id}`;

    const qrDataUrl = await QRCode.toDataURL(verifyURL, {
      margin: 1,
      width: 240,
    });
    const qrBuffer = dataURLtoBuffer(qrDataUrl);

    // PDF setup
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    res.setHeader("Content-disposition", `attachment; filename=SEC_${cert.id}.pdf`);
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    // ----------------------------
    // HEADER
    // ----------------------------
    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#0f172a")
      .text("🌞 Solar Energy Certificate", { align: "center" })
      .moveDown(1);

    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#334155")
      .text(`Certificate ID: ${cert.id}`)
      .text(`Issuer (Producer): ${cert.issuer}`)
      .text(`Owner: ${cert.owner}`)
      .text(`Energy: ${(cert.energyWh / 1000).toFixed(3)} kWh (${cert.energyWh} Wh)`)
      .text(`Issued: ${new Date(cert.timestamp * 1000).toUTCString()}`)
      .text(`Price (wei snapshot): ${cert.priceWei}`)
      .text(`Retired: ${cert.retired ? "YES" : "NO"}`)
      .moveDown(1);

    // ----------------------------
    // TX HASH (MAIN FEATURE)
    // ----------------------------
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#0f172a")
      .text("Transaction Hash:", { underline: true });

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#0369a1")
      .text(txHash, { link: EXPLORER_URL ? `${EXPLORER_URL}${txHash}` : undefined });

    doc.moveDown(1);

    // ----------------------------
    // QR Code
    // ----------------------------
    doc.image(qrBuffer, doc.page.width - 200, 220, { width: 150 });

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#0f172a")
      .text("Scan QR or visit:", 48, 220);

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#0369a1")
      .text(verifyURL, 48, doc.y, { link: verifyURL, underline: true });

    doc.moveDown(2);

    // Footer
    doc
      .fontSize(8)
      .fillColor("#64748b")
      .text(`Contract: ${CONTRACT_ADDRESS}`)
      .text(`Generated: ${new Date().toISOString()}`);

    doc.end();
  } catch (err) {
    console.error("PDF ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
