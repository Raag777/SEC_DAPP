// src/components/dashboards/BlockchainExplorer.jsx
import React, { useState } from "react";
import axios from "axios";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { fmt } from "../../utils/formatTimestamp";
import QR from "../../utils/QRGenerator";

export default function BlockchainExplorer() {
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [certId, setCertId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function verifyOnChain() {
    if (!certId) {
      setErrorMsg("Enter Certificate ID");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axios.get(`${backend}/getSEC/${certId}`);
      setResult(res.data);
    } catch (err) {
      setResult(null);
      setErrorMsg("Certificate not found in blockchain/local database.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blockchain Explorer</h1>

      <Card title="Search Certificate on Blockchain">
        <div className="flex gap-4 items-center">
          <input
            type="number"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            placeholder="Enter Certificate ID"
            className="border p-2 rounded w-full"
          />
          <Button onClick={verifyOnChain}>Search</Button>
          <Button className="bg-gray-600" onClick={() => { setCertId(""); setResult(null); setErrorMsg(""); }}>Clear</Button>
        </div>

        {errorMsg && <p className="text-red-600 text-sm mt-3">{errorMsg}</p>}
      </Card>

      {loading && <p className="text-gray-700 mt-3">Checking blockchain...</p>}

      {result && (
        <Card title="Certificate Details">
          <div className="space-y-2">
            <p><strong>ID:</strong> {result.id}</p>
            <p><strong>Owner:</strong> {result.owner}</p>
            <p><strong>Energy:</strong> {result.energyProduced_kWh} kWh</p>
            <p><strong>Timestamp:</strong> {fmt(result.timestamp)}</p>

            <div className="mt-4"><QR text={`${window.location.origin}/certificate/${result.id}`} size={120} /></div>

            <div className="mt-4">
              <a href={`${backend}/download_certificate/${result.id}`} target="_blank" rel="noreferrer" className="text-blue-600 underline">Download PDF Certificate</a>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
