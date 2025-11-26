// backend-node/src/api/receipt.js
import express from "express";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { ethers } from "ethers";
import solarABI from "../abi/SolarEnergyCertificate.json" with { type: "json" };

const router = express.Router();

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
const EXPLORER_URL = process.env.EXPLORER_URL || "";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, solarABI, provider);

function dataURLtoBuffer(dataURL) {
  const matches = dataURL.match(/^data:.+;base64,(.*)$/);
  return Buffer.from(matches[1], "base64");
}

// -------------------------------------------------------------
// PURCHASE RECEIPT PDF
// -------------------------------------------------------------
router.get("/download_receipt/:id/:txHash", async (req, res) => {
  const id = Number(req.params.id);
  const txHash = req.params.txHash;

  if (!id || !txHash)
    return res.status(400).json({ error: "Invalid parameters" });

  try {
    // ---------------------------------------------------------
    // 1) Fetch the Certificate Snapshot
    // ---------------------------------------------------------
    const c = await contract.getCertificate(id);

    const cert = {
      id: Number(c[0]),
      owner: c[1],
      energyWh: Number(c[2]),
      timestamp: Number(c[3]),
      retired: Boolean(c[4]),
      issuer: c[5],
      priceWei: c[6].toString(),
    };

    // ---------------------------------------------------------
    // 2) Fetch Transaction to determine buyer + seller
    // ---------------------------------------------------------
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) throw new Error("Transaction not found");

    const logs = receipt.logs;

    let buyer = "UNKNOWN";
    let seller = cert.owner;

    // Look for CertificatePurchased event
    try {
      const eventIface = new ethers.Interface(solarABI);
      for (const log of logs) {
        try {
          const parsed = eventIface.parseLog(log);
          if (parsed?.name === "CertificatePurchased") {
            seller = parsed.args.from;
            buyer = parsed.args.to;
          }
        } catch (_) {}
      }
    } catch (err) {
      console.log("Event decode error:", err.message);
    }

    // ---------------------------------------------------------
    // 3) Generate QR Code (points to purchase verification)
    // ---------------------------------------------------------
    const verifyPurchaseURL = `${FRONTEND_URL}/purchase/${txHash}`;
    const qrDataUrl = await QRCode.toDataURL(verifyPurchaseURL, {
      margin: 1,
      width: 240,
    });
    const qrBuffer = dataURLtoBuffer(qrDataUrl);

    // ---------------------------------------------------------
    // 4) PDF Response Headers
    // ---------------------------------------------------------
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    res.setHeader("Content-disposition", `attachment; filename=PurchaseReceipt_${id}.pdf`);
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    // ---------------------------------------------------------
    // HEADER
    // ---------------------------------------------------------
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor("#0f172a")
      .text("Solar Energy Certificate — Purchase Receipt", { align: "center" })
      .moveDown(1.2);

    // ---------------------------------------------------------
    // Certificate + Transaction Data
    // ---------------------------------------------------------
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .fillColor("#0f172a")
      .text(`Certificate ID: ${cert.id}`)
      .font("Helvetica")
      .text(`Energy: ${(cert.energyWh / 1000).toFixed(3)} kWh (${cert.energyWh} Wh)`)
      .text(`Price: ${cert.priceWei} wei (${ethers.formatEther(cert.priceWei)} ETH)`)
      .moveDown(1);

    doc
      .font("Helvetica-Bold")
      .text("Buyer:", { continued: true })
      .font("Helvetica")
      .text(`  ${buyer}`)
      .font("Helvetica-Bold")
      .text("Seller:", { continued: true })
      .font("Helvetica")
      .text(`  ${seller}`)
      .moveDown(1);

    doc
      .font("Helvetica-Bold")
      .text("Purchase Transaction:", { underline: true })
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#0369a1")
      .text(txHash, {
        link: EXPLORER_URL ? `${EXPLORER_URL}${txHash}` : undefined,
        underline: true,
      })
      .moveDown(1.5);

    // ---------------------------------------------------------
    // QR Code Block
    // ---------------------------------------------------------
    doc.image(qrBuffer, doc.page.width - 200, 240, { width: 150 });

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#0f172a")
      .text("Verify Purchase:", 48, 240)
      .font("Helvetica")
      .fillColor("#0369a1")
      .text(verifyPurchaseURL, {
        link: verifyPurchaseURL,
        underline: true,
      });

    // ---------------------------------------------------------
    // Footer
    // ---------------------------------------------------------
    doc.moveDown(3);
    doc
      .fontSize(8)
      .fillColor("#64748b")
      .text(`Contract: ${CONTRACT_ADDRESS}`)
      .text(`Generated: ${new Date().toISOString()}`);

    doc.end();
  } catch (err) {
    console.error("RECEIPT PDF ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
