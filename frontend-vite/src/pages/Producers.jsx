// frontend-vite/src/pages/Producers.jsx
import React, { useState, useEffect } from "react";
import { useContract } from "@/context/ContractProvider";
import Button from "@/components/Button";
import api from "@/api/axiosClient";
import { recordLatency } from "@/api/metrics";

export default function ProducersPage() {
  const { connectWallet, walletAddress, connected } = useContract();
  const [energy, setEnergy] = useState("");
  const [certs, setCerts] = useState([]);
  const [producers, setProducers] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch registered producers from admin API
  async function fetchProducers() {
    try {
      setLoading(true);
      const res = await api.get("/admin/producers");
      const producerList = res.data.producers || [];
      setProducers(producerList);

      // Auto-select first producer if available
      if (producerList.length > 0 && !selectedProducer) {
        setSelectedProducer(producerList[0]);
      }
    } catch (e) {
      console.error("Failed to fetch producers:", e);
      setProducers([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyCerts() {
    if (!selectedProducer) return;
    try {
      const res = await api.get(`/certificates/owner/${selectedProducer}`);
      const certIds = res.data.certificates || [];

      // Fetch details for each certificate
      const certDetails = await Promise.all(
        certIds.map(async (id) => {
          try {
            const detailRes = await api.get(`/certificates/${id}`);
            return detailRes.data;
          } catch (e) {
            console.warn(`Failed to fetch cert ${id}`, e);
            return null;
          }
        })
      );

      setCerts(certDetails.filter(c => c !== null));
    } catch (e) {
      console.warn("fetchMyCerts", e);
      setCerts([]);
    }
  }

  useEffect(() => {
    fetchProducers();
  }, []);

  useEffect(() => {
    fetchMyCerts();
  }, [selectedProducer]);

  async function handleIssue() {
    if (!energy) return alert("Enter energy (kWh)");
    if (!selectedProducer) return alert("Please select a producer");

    try {
      const submittedAt = Date.now(); // Record submission time
      const payload = {
        owner: selectedProducer,
        energyWh: Math.round(Number(energy) * 1000),
        producerAddress: selectedProducer
      };
      const res = await api.post("/producers/issue", payload);

      // Record latency metric if transaction hash is available
      if (res.data?.txHash) {
        try {
          await recordLatency(res.data.txHash, submittedAt);
        } catch (metricError) {
          console.warn("Failed to record latency metric:", metricError);
        }
      }

      alert("Certificate issued: ID " + (res.data?.certificateId || "unknown"));
      setEnergy("");
      fetchMyCerts();
    } catch (e) {
      alert("Error issuing certificate: " + (e?.response?.data?.error || e?.message || e));
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gradient-solar mb-2 flex items-center gap-2">
          <span className="text-4xl">⚡</span> Producer Dashboard
        </h1>
        <p className="text-gray-600">Issue solar energy certificates and manage your production records</p>
      </div>

      {/* Producer Selection */}
      <div className="solar-card p-6">
        <label className="block text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "#000" }}>
            <span>👤</span> Select Producer Account
          </label>

        {loading ? (
          <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">Loading producers...</div>
        ) : producers.length === 0 ? (
          <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-red-700 font-medium">⚠️ No producers registered</p>
            <p className="text-sm text-red-600 mt-1">Please register producers in the Admin panel first.</p>
          </div>
        ) : (
          <>
            <select
              value={selectedProducer}
              onChange={(e) => setSelectedProducer(e.target.value)}
              className="w-full md:w-2/3 p-3 border-2 border-solar-300 rounded-lg bg-white font-mono text-sm focus:ring-2 focus:ring-solar-500 focus:border-transparent"
            >
              {producers.map((addr, idx) => (
                <option key={addr} value={addr}>
                  P{idx + 1}: {addr}
                </option>
              ))}
            </select>
            {selectedProducer && (
              <div className="mt-3 inline-block">
                <span className="badge badge-solar text-base">
                  ✓ Selected: P{producers.indexOf(selectedProducer) + 1}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Certificate Card */}
        <div className="solar-card p-6 bg-gradient-to-br from-solar-50 to-white border-2 border-solar-200">
          <h3 className="text-2xl font-bold mb-4 text-solar-700 flex items-center gap-2">
            <span>📜</span> Issue Certificate
          </h3>
          <p className="text-sm text-gray-600 mb-4">Create a new solar energy certificate on the blockchain</p>

          <label className="block text-sm font-semibold mb-2 text-gray-700">Energy Generated (kWh)</label>
          <input
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
            placeholder="e.g., 12.5"
            type="number"
            step="0.1"
            className="w-full p-3 border-2 border-solar-300 rounded-lg mb-4 focus:ring-2 focus:ring-solar-500 focus:border-transparent"
            disabled={!selectedProducer}
          />
          <button
            onClick={handleIssue}
            className="btn-solar w-full text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedProducer}
          >
            <span>⚡</span>
            Issue Certificate as {selectedProducer ? `P${producers.indexOf(selectedProducer) + 1}` : "..."}
          </button>
          {!selectedProducer && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs text-yellow-700">
              ⚠️ Please select a producer first
            </div>
          )}
        </div>

        {/* Certificates List Card */}
        <div className="solar-card p-6">
          <h3 className="text-2xl font-bold mb-4 text-solar-700 flex items-center gap-2">
            <span>📋</span> My Certificates
            {selectedProducer && (
              <span className="badge badge-solar ml-2">
                P{producers.indexOf(selectedProducer) + 1}
              </span>
            )}
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {certs.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">📄 No certificates issued yet</p>
                <p className="text-gray-400 text-xs mt-1">Issue your first certificate to get started</p>
              </div>
            ) : (
              certs.map((c) => (
                <div key={c.id} className={`p-4 border-2 rounded-lg transition ${
                  c.retired
                    ? "border-gray-300 bg-gray-100 opacity-75"
                    : "border-solar-200 bg-gradient-to-r from-solar-50 to-white hover:shadow-solar"
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🏆</span>
                        <div>
                 <div className="font-bold text-lg text-black">
                   P{producers.indexOf(selectedProducer) + 1}_ID{c.id}
                 </div>

                          {c.retired && (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
                              RETIRED
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1 bg-white/50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">⚡ Energy:</span>
                          <span className="text-energy-600 font-bold">{Math.round((c.energyWh || 0) / 1000)} kWh</span>
                          <span className="text-xs text-gray-500">({c.energyWh} Wh)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">📅 Issued:</span>
                          <span>{new Date(c.timestamp * 1000).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">💰 Price:</span>
                          <span>{(parseInt(c.priceWei || 0) / 1e18).toFixed(6)} ETH</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">👤 Owner:</span>
                          <span className="font-mono text-xs">{c.owner?.slice(0, 10)}...{c.owner?.slice(-8)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a
                        className="inline-block px-4 py-2 bg-sky-gradient text-white rounded-lg text-sm font-semibold hover:shadow-lg transition text-center"
                        href={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/download_certificate/${c.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        📄 Download PDF
                      </a>
                      <a
                        className="inline-block px-4 py-2 bg-solar-100 text-solar-700 border border-solar-300 rounded-lg text-sm font-semibold hover:bg-solar-200 transition text-center"
                        href={`/certificate/${c.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        🔍 View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
