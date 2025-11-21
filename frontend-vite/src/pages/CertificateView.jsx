// frontend-vite/src/pages/CertificateView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CertificateView() {
  const { tokenId } = useParams();
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [cert, setCert] = useState(null);

  useEffect(() => {
    (async () => {
      if (!tokenId) return;
      try {
        const res = await fetch(`${backend}/getSEC/${Number(tokenId)}`);
        const data = await res.json();
        if (!data.error) setCert(data);
      } catch (e) { setCert(null); }
    })();
  }, [tokenId]);

  if (!cert) return <div className="p-6">Certificate not found</div>;

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded shadow max-w-xl">
        <div className="text-2xl font-bold mb-4">Solar Energy Certificate</div>
        <div>Certificate ID: #{cert.id}</div>
        <div>Owner: {cert.owner}</div>
        <div>Energy: {Math.round((cert.energyWh || cert.energyProduced || 0) / 1000)} kWh</div>
        <div>Timestamp: {new Date(cert.timestamp * 1000).toLocaleString()}</div>
        <div className="mt-4">
          <a className="text-blue-600 underline" href={`${backend}/download_certificate/${cert.id}`} target="_blank" rel="noreferrer">Download PDF</a>
        </div>
      </div>
    </div>
  );
}
