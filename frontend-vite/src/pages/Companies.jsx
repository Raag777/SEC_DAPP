// src/pages/Companies.jsx
import React, { useState } from "react";
import api from "@/api/axiosClient";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { downloadBlob } from "@/utils/download";

/**
 * Company page (simplified)
 * - buy certificate by ID (calls backend)
 * - download purchase receipt PDF if backend returns receiptId
 *
 * Backend endpoints expected:
 * POST /companies/buy     { id }
 * GET  /api/receipt/:id   -> PDF blob
 */

export default function Companies() {
  const [certId, setCertId] = useState("");
  const [status, setStatus] = useState("");
  const [lastTx, setLastTx] = useState(null);

  async function buyCertificate() {
    if (!certId) return setStatus("Enter certificate ID");
    setStatus("Sending purchase request...");
    try {
      const resp = await api.post("/companies/buy", { id: Number(certId) });
      // backend should return { txHash, receiptId }
      const txHash = resp.data.txHash || resp.data.tx || resp.data.receiptId;
      const receiptId = resp.data.receiptId;

      setLastTx(txHash);
      setStatus("Purchase successful — tx: " + (txHash || "n/a"));

      if (receiptId) {
        // download receipt PDF
        const blobResp = await api.get(`/api/receipt/${receiptId}`, { responseType: "blob" });
        downloadBlob(blobResp.data, `purchase_receipt_${certId}.pdf`);
        setStatus((s)=> s + " — receipt downloaded");
      }
    } catch (e) {
      console.error(e);
      setStatus("Purchase failed: " + (e?.response?.data?.error || e.message));
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Company Marketplace</h1>

      <Card>
        <div className="flex gap-3 items-center">
          <input value={certId} onChange={(e)=>setCertId(e.target.value)} placeholder="Certificate ID" className="flex-1 border p-2 rounded" />
          <Button onClick={buyCertificate}>Buy SEC</Button>
        </div>

        <p className="mt-3 text-sm text-gray-600">{status}</p>

        {lastTx && (
          <div className="mt-4 text-sm">
            <strong>Last tx:</strong> <span className="font-mono">{lastTx}</span>
          </div>
        )}
      </Card>

      <Card className="mt-6">
        <h3 className="font-semibold">Verified Certificates / Search</h3>
        <p className="text-sm text-gray-500 mt-2">Use the blockchain explorer page to search and verify SECs by ID or tx hash.</p>
      </Card>
    </div>
  );
}
