// src/pages/Companies.jsx
import React, { useState, useEffect } from "react";
import api from "@/api/axiosClient";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { downloadBlob } from "@/utils/download";
import { recordLatency } from "@/api/metrics";

/**
 * Company page
 * - Select company account (C1, C2, C3...)
 * - Buy certificate by ID (calls backend)
 * - View purchased certificates for selected company
 * - Download purchase receipt PDF
 *
 * Backend endpoints:
 * GET  /admin/companies        -> { companies: [...] }
 * POST /certificates/purchase  -> { txHash, blockNumber, ... }
 * GET  /certificates/owner/:address -> { certificates: [...] }
 */

export default function Companies() {
  const [certId, setCertId] = useState("");
  const [status, setStatus] = useState("");
  const [lastTx, setLastTx] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [ownedCerts, setOwnedCerts] = useState([]);
  const [verifying, setVerifying] = useState(false);
  const [verifiedCert, setVerifiedCert] = useState(null);
  const [verifyCertId, setVerifyCertId] = useState("");
  const [producers, setProducers] = useState([]);

  // Fetch registered companies from admin API
  async function fetchCompanies() {
    try {
      setLoading(true);
      const res = await api.get("/admin/companies");
      const companyList = res.data.companies || [];
      setCompanies(companyList);

      // Auto-select first company if available
      if (companyList.length > 0 && !selectedCompany) {
        setSelectedCompany(companyList[0]);
      }
    } catch (e) {
      console.error("Failed to fetch companies:", e);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch certificates owned by selected company
  async function fetchOwnedCertificates() {
    if (!selectedCompany) return;
    try {
      const res = await api.get(`/certificates/owner/${selectedCompany}`);
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

      setOwnedCerts(certDetails.filter(c => c !== null));
    } catch (e) {
      console.warn("Failed to fetch owned certificates:", e);
      setOwnedCerts([]);
    }
  }

  // Fetch producers list
  async function fetchProducers() {
    try {
      const res = await api.get("/admin/producers");
      setProducers(res.data.producers || []);
    } catch (e) {
      console.error("Failed to fetch producers:", e);
    }
  }

  // Verify certificate before purchase
  async function verifyCertificate() {
    if (!verifyCertId) return alert("Enter certificate ID to verify");
    setVerifying(true);
    setVerifiedCert(null);
    try {
      const res = await api.get(`/certificates/${verifyCertId}`);
      const cert = res.data;

      // Get producer label if issuer is a producer
      let issuerLabel = cert.issuer;
      const issuerProducerIndex = producers.findIndex(p => p.toLowerCase() === cert.issuer.toLowerCase());
      if (issuerProducerIndex !== -1) {
        issuerLabel = `P${issuerProducerIndex + 1} (${cert.issuer})`;
      }

      setVerifiedCert({ ...cert, issuerLabel });
      setStatus(`✅ Certificate verified! Ready to purchase.`);
    } catch (e) {
      setStatus(`❌ Verification failed: ${e?.response?.data?.error || e.message}`);
      setVerifiedCert(null);
    } finally {
      setVerifying(false);
    }
  }

  useEffect(() => {
    fetchCompanies();
    fetchProducers();
  }, []);

  useEffect(() => {
    fetchOwnedCertificates();
  }, [selectedCompany]);

  async function buyCertificate() {
    if (!certId) return setStatus("Enter certificate ID");
    if (!selectedCompany) return setStatus("Please select a company");

    setStatus("Sending purchase request...");
    try {
      const submittedAt = Date.now(); // Record submission time

      // First get certificate details to know the price
      const certRes = await api.get(`/certificates/${certId}`);
      const cert = certRes.data;

      const resp = await api.post("/certificates/purchase", {
        id: Number(certId),
        valueWei: cert.priceWei,
        companyAddress: selectedCompany
      });

      const txHash = resp.data.txHash;
      setLastTx(txHash);

      // Record latency metric if transaction hash is available
      if (txHash) {
        try {
          await recordLatency(txHash, submittedAt);
        } catch (metricError) {
          console.warn("Failed to record latency metric:", metricError);
        }
      }

      setStatus("Purchase successful! Tx: " + (txHash || "n/a"));

      // Refresh owned certificates
      fetchOwnedCertificates();
      setCertId("");
    } catch (e) {
      console.error(e);
      setStatus("Purchase failed: " + (e?.response?.data?.error || e.message));
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gradient-energy mb-2 flex items-center gap-2">
          <span className="text-4xl">🏢</span> Company Marketplace
        </h1>
        <p className="text-gray-600">Purchase solar energy certificates and offset your carbon footprint</p>
      </div>

      {/* Company Selector */}
      <div className="solar-card p-6">
<label className="block text-lg font-semibold mb-3 text-black flex items-center gap-2">
  <span>🏢</span> Select Company Account
</label>

        {loading ? (
          <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">Loading companies...</div>
        ) : companies.length === 0 ? (
          <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-red-700 font-medium">⚠️ No companies registered</p>
            <p className="text-sm text-red-600 mt-1">Please register companies in the Admin panel first.</p>
          </div>
        ) : (
          <>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full md:w-2/3 p-3 border-2 border-energy-300 rounded-lg bg-white font-mono text-sm focus:ring-2 focus:ring-energy-500 focus:border-transparent"
            >
              {companies.map((addr, idx) => (
                <option key={addr} value={addr}>
                  C{idx + 1}: {addr}
                </option>
              ))}
            </select>
            {selectedCompany && (
              <div className="mt-3 inline-block">
                <span className="badge badge-energy text-base">
                  ✓ Selected: C{companies.indexOf(selectedCompany) + 1}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verify & Purchase Certificate Card */}
        <div className="solar-card p-6 bg-gradient-to-br from-energy-50 to-white border-2 border-energy-200">
          <h3 className="text-2xl font-bold mb-4 text-energy-700 flex items-center gap-2">
            <span>🔍</span> Verify & Purchase Certificate
          </h3>
          <p className="text-sm text-gray-600 mb-4">Verify certificate details before purchasing</p>

          {/* Verification Section */}
          <div className="mb-6 p-4 bg-sky-50 rounded-lg border border-sky-200">
            <label className="block text-sm font-semibold mb-2 text-sky-700">1. Verify Certificate</label>
            <div className="flex gap-2 mb-3">
              <input
                value={verifyCertId}
                onChange={(e) => {
                  setVerifyCertId(e.target.value);
                  setCertId(e.target.value);
                  setVerifiedCert(null);
                }}
                placeholder="Enter certificate ID"
                type="number"
                className="flex-1 p-3 border-2 border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                disabled={!selectedCompany}
              />
              <button
                onClick={verifyCertificate}
                className="px-6 py-3 bg-sky-gradient text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                disabled={!selectedCompany || verifying}
              >
                {verifying ? "⚙️" : "🔍"} Verify
              </button>
            </div>

            {/* Verified Certificate Info */}
            {verifiedCert && (
       <div className="bg-white p-4 rounded-lg border-2 border-green-300 space-y-2 text-black">
  <div className="flex items-center gap-2 mb-2">
    <span className="text-2xl">✅</span>
    <span className="font-bold text-lg">Certificate Verified</span>
  </div>

  <div className="text-sm space-y-1">
    <div>
      <span className="font-semibold">Issuer:</span>
      <span className="text-xs font-mono">{verifiedCert.issuerLabel}</span>
    </div>

    <div>
      <span className="font-semibold">Energy:</span>
      <span className="font-bold">
        {(verifiedCert.energyWh / 1000).toFixed(3)} kWh
      </span>
    </div>

    <div>
      <span className="font-semibold">Price:</span>
      <span className="font-bold">
        {(parseInt(verifiedCert.priceWei) / 1e18).toFixed(6)} ETH
      </span>
    </div>

    <div>
      <span className="font-semibold">Status:</span>
      <span className={verifiedCert.retired ? "text-red-600" : "text-green-600"}>
        {verifiedCert.retired ? "RETIRED ❌" : "ACTIVE ✅"}
      </span>
    </div>

    <div>
      <span className="font-semibold">Issued:</span>
      {new Date(verifiedCert.timestamp * 1000).toLocaleString()}
    </div>
  </div>
</div>

            )}
          </div>

          {/* Purchase Section */}
          <div className="p-4 bg-energy-50 rounded-lg border border-energy-200">
        <label className="block text-sm font-semibold mb-2 text-black">
               2. Purchase Certificate
        </label>

            <button
              onClick={buyCertificate}
              className="btn-energy w-full text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedCompany || !verifiedCert || verifiedCert.retired}
            >
              <span>🛒</span>
              Purchase as {selectedCompany ? `C${companies.indexOf(selectedCompany) + 1}` : "..."}
            </button>
          </div>

          {!selectedCompany && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs text-yellow-700">
              ⚠️ Please select a company first
            </div>
          )}

          {status && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              status.includes('failed') || status.includes('Failed')
                ? 'bg-red-100 text-red-700 border border-red-300'
                : status.includes('successful')
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-sky-100 text-sky-700 border border-sky-300'
            }`}>
              {status}
            </div>
          )}

          {lastTx && (
            <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg">
              <div className="text-xs font-semibold text-sky-700 mb-1">Transaction Hash:</div>
              <div className="font-mono text-xs text-sky-900 break-all">{lastTx}</div>
            </div>
          )}
        </div>

        {/* Owned Certificates Card */}
        <div className="solar-card p-6">
          <h3 className="text-2xl font-bold mb-4 text-energy-700 flex items-center gap-2">
            <span>🎫</span> My Certificates
            {selectedCompany && (
              <span className="badge badge-energy ml-2">
                C{companies.indexOf(selectedCompany) + 1}
              </span>
            )}
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {!selectedCompany ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">🏢 Please select a company</p>
              </div>
            ) : ownedCerts.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">🎫 No certificates purchased yet</p>
                <p className="text-gray-400 text-xs mt-1">Purchase your first certificate to support clean energy</p>
              </div>
            ) : (
              ownedCerts.map((cert) => (
                <div key={cert.id} className={`p-4 border-2 rounded-lg transition ${
                  cert.retired
                    ? 'border-gray-300 bg-gray-100 opacity-75'
                    : 'border-energy-200 bg-gradient-to-r from-energy-50 to-white hover:shadow-energy'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🏆</span>
                        <div>
                    <div className="font-bold text-lg !text-black">
                      C{companies.indexOf(selectedCompany) + 1}_ID{cert.id}
                     </div>

                          {cert.retired && (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
                              RETIRED
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1 bg-white/50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">⚡ Energy:</span>
                          <span className="text-energy-600 font-bold">{Math.round(cert.energyWh / 1000)} kWh</span>
                          <span className="text-xs text-gray-500">({cert.energyWh} Wh)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">📅 Issued:</span>
                          <span>{new Date(cert.timestamp * 1000).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">💰 Paid:</span>
                          <span className="text-energy-600 font-bold">{(parseInt(cert.priceWei) / 1e18).toFixed(6)} ETH</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">👤 Issuer:</span>
                          <span className="font-mono text-xs">{cert.issuer?.slice(0,10)}...{cert.issuer?.slice(-8)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a
                        className="inline-block px-4 py-2 bg-sky-gradient text-white rounded-lg text-sm font-semibold hover:shadow-lg transition text-center"
                        href={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/download_certificate/${cert.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        📄 Download PDF
                      </a>
                      <a
                        className="inline-block px-4 py-2 bg-energy-100 text-energy-700 border border-energy-300 rounded-lg text-sm font-semibold hover:bg-energy-200 transition text-center"
                        href={`/certificate/${cert.id}`}
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

      {/* Help Card */}
      <div className="solar-card p-6 bg-gradient-to-r from-sky-50 to-energy-50">
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <span>💡</span> Need Help?
        </h3>
        <p className="text-sm text-gray-600">
          Use the <a href="/explorer" className="text-sky-600 font-semibold hover:underline">Blockchain Explorer</a> to search and verify certificates by ID or transaction hash.
        </p>
      </div>
    </div>
  );
}
