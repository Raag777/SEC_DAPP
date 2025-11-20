import { useState } from "react";
import { adminMintCertificate } from "../api/admin";
import { motion } from "framer-motion";

export default function AdminMint() {
  const [producer, setProducer] = useState("");
  const [energy, setEnergy] = useState("");
  const [certID, setCertID] = useState("");
  const [loading, setLoading] = useState(false);

  const mint = async () => {
    if (!producer || !energy || !certID) return alert("Fill all fields!");
    setLoading(true);

    try {
      await adminMintCertificate(producer, energy, certID);
      alert("Certificate Minted Successfully!");
    } catch (err) {
      alert("Mint failed!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Admin — Mint SEC Certificate</h1>

      <div className="space-y-4 max-w-xl">
        <input
          placeholder="Producer Address"
          className="input"
          value={producer}
          onChange={(e) => setProducer(e.target.value)}
        />

        <input
          placeholder="Energy Generated (kWh)"
          className="input"
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}
        />

        <input
          placeholder="Certificate ID (e.g., P1_ID1)"
          className="input"
          value={certID}
          onChange={(e) => setCertID(e.target.value)}
        />

        <button
          onClick={mint}
          className="btn"
          disabled={loading}
        >
          {loading ? "Minting..." : "Mint Certificate"}
        </button>
      </div>
    </div>
  );
}
