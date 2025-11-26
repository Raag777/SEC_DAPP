// frontend-vite/src/pages/CertificateView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axiosClient";

export default function CertificateView() {
  const { id } = useParams();
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(`/certificates/${id}`);
        setCert(res.data);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch certificate:", e);
        setError(e?.response?.data?.error || e.message || "Failed to load certificate");
        setCert(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="solar-card p-12 text-center">
          <div className="text-solar-600 text-xl font-semibold flex items-center justify-center gap-2">
            <span className="animate-spin text-2xl">⚙️</span> Loading certificate...
          </div>
        </div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="solar-card p-12 bg-red-50 border-2 border-red-300">
          <h2 className="text-2xl font-bold text-red-700 mb-3">❌ Certificate Not Found</h2>
          <p className="text-red-600">{error || "The requested certificate could not be found."}</p>
          <a href="/" className="inline-block mt-4 btn-solar">← Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-linear-solar mb-2 flex items-center gap-2">
          <span className="text-4xl">📜</span> Solar Energy Certificate
        </h1>
        <p className="text-gray-600">Certificate ID #{cert.id}</p>
      </div>

      {/* Certificate Details Card */}
      <div className="solar-card p-8 bg-linear-to-br from-solar-50 to-white border-2 border-solar-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Certificate ID</h3>
            <p className="text-2xl font-bold text-solar-700 text-green-600 ">#{cert.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Status</h3>
            <p className={`text-xl font-bold ${cert.retired ? 'text-red-600' : 'text-green-600'}`}>
              {cert.retired ? '🔒 RETIRED' : '✅ ACTIVE'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Owner Address</h3>
            <p className="font-mono text-sm text-gray-800 break-all">{cert.owner}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Issuer Address</h3>
            <p className="font-mono text-sm text-gray-800 break-all">{cert.issuer}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-linear-to-br from-energy-50 to-white p-4 rounded-lg border-2 border-energy-200">
              <h3 className="text-sm font-semibold text-energy-700 mb-1">⚡ Energy Produced</h3>
              <p className="text-3xl font-bold text-energy-600 text-black ">{(cert.energyWh / 1000).toFixed(3)} kWh</p>
              <p className="text-xs text-gray-500 mt-1">{cert.energyWh} Wh</p>
            </div>

            <div className="bg-linear-to-br from-sky-50 to-white p-4 rounded-lg border-2 border-sky-200">
              <h3 className="text-sm font-semibold text-sky-700 mb-1">💰 Price</h3>
              <p className="text-3xl font-bold text-sky-600">
                {(parseInt(cert.priceWei) / 1e18).toFixed(6)} ETH
              </p>
              <p className="text-xs text-gray-500 mt-1">{cert.priceWei} wei</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 mb-1">📅 Issued On</h3>
            <p className="text-lg text-gray-800">{new Date(cert.timestamp * 1000).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Actions Card */}
      <div className="solar-card p-6 bg-white">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📄 Download Options</h3>
        <div className="flex flex-wrap gap-4">
          <a
            className="btn-solar flex items-center gap-2"
            href={`${backend}/api/download_certificate/${cert.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <span>📄</span> Download Certificate PDF
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          The certificate PDF includes a QR code for blockchain verification
        </p>
      </div>

      {/* Back Button */}
      <div>
        <a href="/" className="text-solar-600 font-semibold hover:underline">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
