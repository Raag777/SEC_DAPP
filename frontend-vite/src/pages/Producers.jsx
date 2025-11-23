// frontend-vite/src/pages/Producers.jsx
import React, { useState, useEffect } from "react";
import { useContract } from "@/context/ContractProvider";
import Button from "@/components/Button";
import axios from "axios";

export default function ProducersPage() {
  const { connectWallet, walletAddress, connected } = useContract();
  const [energy, setEnergy] = useState("");
  const [certs, setCerts] = useState([]);

  async function fetchMyCerts() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/certificates.json`);
      const mine = (res.data || []).filter(c => (c.owner || "").toLowerCase() === (walletAddress || "").toLowerCase());
      setCerts(mine);
    } catch (e) {
      console.warn("fetchMyCerts", e);
      setCerts([]);
    }
  }

  useEffect(() => {
    fetchMyCerts();
  }, [walletAddress]);

  async function handleIssue() {
    if (!energy) return alert("Enter energy (kWh)");
    try {
      const payload = { to: walletAddress, energyWh: Math.round(Number(energy) * 1000) };
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/mint`, payload);
      alert("Certificate issued: " + (res.data?.certificate?.id || "unknown"));
      setEnergy("");
      fetchMyCerts();
    } catch (e) {
      alert("Error issuing certificate: " + (e?.message || e));
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Producer Dashboard</h1>

      <div className="mb-4">
        {!connected ? (
          <Button onClick={connectWallet} className="neon-pulse">Connect MetaMask</Button>
        ) : (
          <div className="text-sm">Connected: <code>{walletAddress}</code></div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded shadow" 
             style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>

          <label className="block text-sm mb-2">Energy (kWh)</label>
          <input value={energy} onChange={(e)=>setEnergy(e.target.value)} placeholder="e.g., 12.5" className="w-full p-2 border rounded mb-3" />
          <Button onClick={handleIssue} className="bg-neonBlue/20 hover:bg-neonBlue text-black">Issue Certificate </Button>
        </div>

        <div className="p-4 rounded shadow" 
             style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>

          <h3 className="font-semibold mb-2">Your Certificates</h3>
          <div className="space-y-2">
            {certs.length === 0 ? <div className="text-sm text-gray-500">No certs</div> : certs.map(c=>(
              <div key={c.id} className="p-2 border rounded flex justify-between">
                <div>
                  <div>ID #{c.id}</div>
                  <div className="text-xs text-gray-500">{Math.round((c.energyWh||0)/1000)} kWh — {new Date(c.timestamp*1000).toLocaleString()}</div>
                </div>
                <div>
                  <a className="text-blue-600 underline" href={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/download_certificate/${c.id}`} target="_blank" rel="noreferrer">PDF</a>
                  <Button onClick={() => downloadReceipt(cert.id, cert.txHash)} className="bg-neonBlue/20 hover:bg-neonBlue text-black"> Download Receipt </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
