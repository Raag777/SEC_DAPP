// src/components/dashboards/ProducerDashboard.jsx
import React, { useEffect, useState } from "react";
import useContract from "../../hooks/useContract";
import Card from "../ui/Card";
import Button from "../ui/Button";
import IoTSimulator from "../IoTSimulator";
import { fmt } from "../../utils/formatTimestamp";
import QR from "../../utils/QRGenerator";
import axios from "axios";

export default function ProducerDashboard() {
  const { contract, connectWallet, walletAddress } = useContract();
  const [energy, setEnergy] = useState("");
  const [myCerts, setMyCerts] = useState([]);
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchMyCerts();
  }, [walletAddress]);

  async function fetchMyCerts() {
    if (!walletAddress) return setMyCerts([]);
    try {
      const certsAll = await axios.get(`${backend}/certificates.json`).then((r) => r.data).catch(() => []);
      const mine = (certsAll || []).filter(
        (c) => c.owner?.toLowerCase() === walletAddress?.toLowerCase()
      );
      setMyCerts(mine);
    } catch (e) {
      console.error("fetchMyCerts error", e);
      setMyCerts([]);
    }
  }

  async function issueCustom() {
  if (!energy) return alert("Enter energy (kWh)");
  try {
    const payload = { to: walletAddress, energyKwh: Number(energy) };
    const res = await axios.post(`${backend}/mint`, payload);
    alert(`Certificate issued! ID: ${res.data?.certificate?.id}`);
    setEnergy("");
    fetchMyCerts();
  } catch (err) {
    console.error(err);
    alert("Error issuing certificate: " + err.response?.data?.error || err.message);
  }
}


  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        {!walletAddress ? (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        ) : (
          <div className="text-sm">
            Connected: <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card title="Issue Certificate">
          <label className="block text-sm mb-1">Energy produced (kWh)</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
            placeholder="e.g., 12.5"
            type="number"
          />
          <Button onClick={issueCustom}>Issue Certificate</Button>
        </Card>

        <Card title="Your Certificates">
          <div className="h-64 overflow-auto">
            {myCerts.length === 0 ? (
              <p>No certificates found.</p>
            ) : (
              myCerts.map((c) => (
                <div key={c.id} className="p-2 border-b flex justify-between">
                  <div>
                    <p>ID #{c.id}</p>
                    <p>{Math.round((c.energyWh || 0) / 1000)} kWh</p>
                    <p>{fmt(c.timestamp)}</p>
                  </div>
                  <QR text={`${backend}/verify/${c.id}`} size={60} />
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="IoT Simulator">
          <IoTSimulator onSend={(val) => alert(`Simulated ${val} kWh`)} />
        </Card>
      </div>
    </div>
  );
}
