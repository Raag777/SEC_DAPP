// src/components/dashboards/CertificateViewer.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useContract from "../../hooks/useContract";
import QR from "../../utils/QRGenerator";
import { fmt } from "../../utils/formatTimestamp";

export default function CertificateViewer() {
  const { id } = useParams();
  const { contract } = useContract();
  const [cert, setCert] = useState(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      if (!contract) {
        // no contract -> fallback to backend (public route may still use backend)
        try {
          const res = await fetch(`/getSEC/${Number(id)}`);
          const data = await res.json();
          if (!data.error) setCert(data);
        } catch {
          setCert(null);
        }
        return;
      }

      try {
        const c = await contract.verifyCertificate(Number(id));
        setCert({
          id: Number(c[0]),
          owner: c[1],
          energy: Number(c[2]),
          timestamp: Number(c[3]),
          retired: Boolean(c[4]),
        });
      } catch (e) {
        // fallback to backend if on-chain missing
        try {
          const res = await fetch(`/getSEC/${Number(id)}`);
          const data = await res.json();
          if (!data.error) setCert(data);
        } catch {
          setCert(null);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, id]);

  if (!cert) return <div className="p-6">Certificate not found</div>;

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded shadow max-w-xl">
        <div className="text-2xl font-bold mb-4">Solar Energy Certificate</div>
        <div>Certificate ID: #{cert.id}</div>
        <div>Owner: {cert.owner}</div>
        <div>Energy: {Math.round((cert.energy || cert.energyWh || 0) / 1000)} kWh</div>
        <div>Timestamp: {fmt(cert.timestamp)}</div>
        <div className="mt-4"><QR text={`${window.location.origin}/certificate/${cert.id}`} /></div>
        <div className="mt-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
