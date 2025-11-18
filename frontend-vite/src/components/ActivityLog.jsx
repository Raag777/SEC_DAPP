import React, { useEffect, useState } from "react";
import useContract from "../hooks/useContract";

export default function ActivityLog() {
  const { contract } = useContract();
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (!contract) return;
    const handler = (id, owner, energy, timestamp, ev) => {
      setLog(prev => [{ type: "issue", id: Number(id), owner, energy: Number(energy), timestamp: Number(timestamp), tx: ev.transactionHash }, ...prev]);
    };
    try { contract.on("CertificateIssued", handler); } catch {}
    return () => { try { contract.off("CertificateIssued", handler); } catch {} };
  }, [contract]);

  return (
    <div className="p-6">
      <h3 className="text-lg mb-3">Activity Log</h3>
      <div className="bg-white p-4 rounded shadow h-64 overflow-auto">
        {log.map((l, i) => (
          <div key={i} className="text-sm border-b p-2">
            {`Issued #${l.id} (${l.energy} kWh) to ${l.owner} — tx ${l.tx}`}
          </div>
        ))}
      </div>
    </div>
  );
}
