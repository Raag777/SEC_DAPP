// frontend-vite/src/pages/Companies.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/ui/Button";
import { useContract } from "@/context/ContractProvider";

export default function CompaniesPage() {
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const { connectWallet, connected, walletAddress } = useContract();
  const [certs, setCerts] = useState([]);

  async function loadAll() {
    try {
      const res = await axios.get(`${backend}/certificates.json`);
      setCerts(res.data || []);
    } catch (e) {
      console.error(e);
      setCerts([]);
    }
  }

  useEffect(() => { loadAll(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Company Marketplace</h1>

      <div className="mb-4">
        {!connected ? <Button onClick={connectWallet}>Connect MetaMask</Button> : <div>Connected: <code>{walletAddress}</code></div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map(c => (
          <div key={c.id} className="bg-white rounded p-4 shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Certificate #{c.id}</div>
                <div className="text-xs text-gray-500">{Math.round((c.energyWh||0)/1000)} kWh</div>
                <div className="text-xs text-gray-400">Owner: {c.owner}</div>
              </div>
              <div className="flex flex-col items-end">
                <a className="text-blue-600 underline mb-2" href={`${backend}/download_certificate/${c.id}`} target="_blank" rel="noreferrer">PDF</a>
                <Button onClick={() => alert("Purchase flow to be implemented (backend + escrow)")}>Purchase</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
