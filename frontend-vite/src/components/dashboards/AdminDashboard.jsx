// src/components/dashboards/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../ui/Card";
import Button from "../ui/Button";
import QR from "../../utils/QRGenerator";
import { fmt } from "../../utils/formatTimestamp";
import useContract from "../../hooks/useContract";

export default function AdminDashboard() {
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const { contract, walletAddress } = useContract();

  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [producerAddr, setProducerAddr] = useState("");

  async function loadCerts() {
    try {
      setLoading(true);
      const res = await axios.get(`${backend}/certificates.json`);
      setCerts(res.data || []);
    } catch (e) {
      console.error("Error fetching certificates:", e);
      setCerts([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCerts();
  }, []);

  async function addProducerOnChain() {
    if (!contract || !producerAddr) return alert("Connect & enter producer address");
    try {
      const tx = await contract.registerProducer(producerAddr);
      await tx.wait?.();
      alert("Producer registration transaction sent.");
    } catch (err) {
      alert("Tx failed: " + (err?.message || err));
    }
  }

  async function removeProducerOnChain() {
    if (!contract || !producerAddr) return alert("Connect & enter producer address");
    try {
      const tx = await contract.removeProducer(producerAddr);
      await tx.wait?.();
      alert("Producer removal tx sent.");
    } catch (err) {
      alert("Tx failed: " + (err?.message || err));
    }
  }

  const totalEnergy = certs.reduce((a, c) => a + Number(c.energyWh || 0), 0);
  const uniqueOwners = [...new Set(certs.map((c) => c.owner))];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Certificates Issued"><p className="text-3xl font-bold">{certs.length}</p></Card>
        <Card title="Total Energy Certified (kWh)"><p className="text-3xl font-bold">{Math.round(totalEnergy / 1000)}</p></Card>
        <Card title="Total Unique Users"><p className="text-3xl font-bold">{uniqueOwners.length}</p></Card>
      </div>

      <Card title="Role Management (on-chain)">
        <p className="text-sm mb-2">As a contract admin you can register or remove producers.</p>
        <input className="w-full p-2 border rounded mb-3" placeholder="Producer address" value={producerAddr} onChange={(e)=>setProducerAddr(e.target.value)} />
        <div className="flex gap-3">
          <Button onClick={addProducerOnChain}>Register Producer</Button>
          <Button className="bg-red-600" onClick={removeProducerOnChain}>Remove Producer</Button>
        </div>
      </Card>

      <Card title="All Certificates">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Certificate Records</h2>
          <Button onClick={loadCerts}>Refresh</Button>
        </div>

        <div className="overflow-auto max-h-[420px] border rounded mt-2">
          {certs.map((c) => (
            <div key={c.id} className="border-b p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Certificate ID #{c.id} — {Math.round((c.energyWh || 0)/1000)} kWh</p>
                <p className="text-xs text-gray-600">Owner: {c.owner}</p>
                <p className="text-xs text-gray-600">Timestamp: {fmt(c.timestamp)}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <QR text={`${backend}/verify/${c.id}`} size={80} />
                <a href={`${backend}/download_certificate/${c.id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">Download PDF</a>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
