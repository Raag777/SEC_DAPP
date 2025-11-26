// src/pages/AdminMint.jsx
import React, { useEffect, useState } from "react";
import api from "@/api/axiosClient";
import Button from "@/components/Button";
import Card from "@/components/Card";
import RoleSelector from "@/components/RoleSelector";

/**
 * Admin dashboard for:
 * - register/remove producers
 * - register/remove companies
 * - view lists
 * - change minEnergy / default price
 *
 * NOTE: This UI expects the following backend endpoints:
 * GET  /admin/producers              -> { producers: [addr,...] }
 * GET  /admin/companies              -> { companies: [addr,...] }
 * POST /admin/registerProducer       -> { success: true }
 * POST /admin/removeProducer         -> { success: true }
 * POST /admin/registerCompany        -> { success: true }
 * POST /admin/removeCompany          -> { success: true }
 * POST /admin/setMinEnergy           -> { success: true }
 * POST /admin/setDefaultPrice        -> { success: true }
 */

export default function AdminMint() {
  const [role, setRole] = useState(localStorage.getItem("sec_role_v1") || "guest");
  const [producerAddr, setProducerAddr] = useState("");
  const [companyAddr, setCompanyAddr] = useState("");
  const [producers, setProducers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [minEnergy, setMinEnergy] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function fetchLists() {
    try {
      setLoading(true);
      const p = await api.get("/admin/producers").catch(()=>({ data: { producers: [] }}));
      const c = await api.get("/admin/companies").catch(()=>({ data: { companies: [] }}));
      setProducers(p.data.producers || []);
      setCompanies(c.data.companies || []);
    } catch (e) {
      console.error(e);
      setMsg("Failed to load lists");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLists();
  }, []);

  async function registerProducer() {
    if (!producerAddr) return setMsg("Enter producer address");
    setMsg("");
    try {
      await api.post("/admin/registerProducer", { address: producerAddr });
      setMsg("Producer registered");
      setProducerAddr("");
      fetchLists();
    } catch (e) {
      setMsg("Error: " + (e?.response?.data?.error || e.message));
    }
  }

  async function removeProducer() {
    if (!producerAddr) return setMsg("Enter producer address");
    setMsg("");
    try {
      await api.post("/admin/removeProducer", { address: producerAddr });
      setMsg("Producer removed");
      setProducerAddr("");
      fetchLists();
    } catch (e) {
      setMsg("Error: " + (e?.response?.data?.error || e.message));
    }
  }

  async function registerCompany() {
    if (!companyAddr) return setMsg("Enter company address");
    setMsg("");
    try {
      await api.post("/admin/registerCompany", { address: companyAddr });
      setMsg("Company registered");
      setCompanyAddr("");
      fetchLists();
    } catch (e) {
      setMsg("Error: " + (e?.response?.data?.error || e.message));
    }
  }

  async function removeCompany() {
    if (!companyAddr) return setMsg("Enter company address");
    setMsg("");
    try {
      await api.post("/admin/removeCompany", { address: companyAddr });
      setMsg("Company removed");
      setCompanyAddr("");
      fetchLists();
    } catch (e) {
      setMsg("Error: " + (e?.response?.data?.error || e.message));
    }
  }

  async function updateMinEnergy() {
    if (!minEnergy) return setMsg("Enter min energy (Wh)");
    try {
      await api.post("/admin/setMinEnergy", { minEnergy: Number(minEnergy) });
      setMsg("Min energy updated");
    } catch (e) {
      setMsg("Error updating min energy");
    }
  }

  async function updateDefaultPrice() {
    if (!defaultPrice) return setMsg("Enter default price (wei)");
    try {
      await api.post("/admin/setDefaultPrice", { defaultPriceWei: String(defaultPrice) });
      setMsg("Default price updated");
    } catch (e) {
      setMsg("Error updating price");
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-solar mb-2 flex items-center gap-2">
            <span className="text-4xl">⚙️</span> Admin Panel
          </h1>
          <p className="text-gray-600">Manage producers, companies, and platform policies</p>
        </div>
        <RoleSelector onChange={(r)=>setRole(r)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Producer & Company Management */}
        <Card className="solar-card">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span>👥</span> Account Management
          </h2>
          <p className="text-sm text-gray-500 mb-4">Register or remove producers and companies on the blockchain</p>

          {/* Producer Section */}
          <div className="mb-6 p-4 bg-solar-50 rounded-lg border border-solar-200">
            <h3 className="font-semibold text-solar-700 mb-3 flex items-center gap-2">
              <span>⚡</span> Producer Management
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                className="flex-1 px-3 py-2 border border-solar-300 rounded-lg focus:ring-2 focus:ring-solar-500 focus:border-transparent"
                placeholder="Producer 0x..."
                value={producerAddr}
                onChange={(e)=>setProducerAddr(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="btn-solar flex-1" onClick={registerProducer}>
                ➕ Register
              </button>
              <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition" onClick={removeProducer}>
                ➖ Remove
              </button>
            </div>
          </div>

          {/* Company Section */}
          <div className="mb-6 p-4 bg-energy-50 rounded-lg border border-energy-200">
            <h3 className="font-semibold text-energy-700 mb-3 flex items-center gap-2">
              <span>🏢</span> Company Management
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                className="flex-1 px-3 py-2 border border-energy-300 rounded-lg focus:ring-2 focus:ring-energy-500 focus:border-transparent"
                placeholder="Company 0x..."
                value={companyAddr}
                onChange={(e)=>setCompanyAddr(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="btn-energy flex-1" onClick={registerCompany}>
                ➕ Register
              </button>
              <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition" onClick={removeCompany}>
                ➖ Remove
              </button>
            </div>
          </div>

          {/* Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-solar-50 p-4 rounded-lg border border-solar-200">
              <h3 className="font-semibold text-solar-700 mb-2">Registered Producers</h3>
              {loading ? <p className="text-sm text-gray-500">Loading...</p> : (
                <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
                  {producers.length === 0 ? <li className="text-gray-500 italic">No producers registered</li> :
                    producers.map((p, idx) => (
                      <li key={p} className="font-mono text-xs bg-green-800 p-2 rounded border border-solar-100">
                        <span className="font-bold badge badge-solar">P{idx + 1}</span> {p}
                      </li>
                    ))
                  }
                </ul>
              )}
            </div>

            <div className="bg-energy-50 p-4 rounded-lg border border-energy-200">
              <h3 className="font-semibold text-energy-700 mb-2">Registered Companies</h3>
              {loading ? <p className="text-sm text-gray-500">Loading...</p> : (
                <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
                  {companies.length === 0 ? <li className="text-gray-500 italic">No companies registered</li> :
                    companies.map((c, idx) => (
                      <li key={c} className="font-mono text-xs bg-green-800 p-2 rounded border border-energy-100">
                        <span className="font-bold badge badge-energy">C{idx + 1}</span> {c}
                      </li>
                    ))
                  }
                </ul>
              )}
            </div>
          </div>
        </Card>

        {/* Platform Policies */}
        <Card className="solar-card">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span>📋</span> Platform Policies
          </h2>
          <p className="text-sm text-gray-500 mb-4">Configure system-wide settings and requirements</p>

          <div className="space-y-6">
            {/* Min Energy */}
            <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
              <label className="block text-sm font-semibold text-sky-700 mb-2 flex items-center gap-2">
                <span>⚡</span> Minimum Energy Requirement (Wh)
              </label>
              <p className="text-xs text-gray-600 mb-3">Set the minimum energy (in watt-hours) required for certificate issuance</p>
              <input
                value={minEnergy}
                onChange={(e)=>setMinEnergy(e.target.value)}
                className="w-full px-3 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent mb-3"
                placeholder="e.g., 1000"
                type="number"
              />
              <button className="w-full px-4 py-2 bg-sky-gradient text-white rounded-lg font-semibold hover:shadow-lg transition" onClick={updateMinEnergy}>
                💾 Update Min Energy
              </button>
            </div>

            {/* Default Price */}
            <div className="p-4 bg-solar-50 rounded-lg border border-solar-200">
              <label className="block text-sm font-semibold text-solar-700 mb-2 flex items-center gap-2 text-black">
                <span>💰</span> Default Certificate Price (wei) 
              </label>
              <p className="text-xs text-gray-600 mb-3">Set the default price in wei (1 ETH = 10¹⁸ wei)</p>
              <input
                value={defaultPrice}
                onChange={(e)=>setDefaultPrice(e.target.value)}
                className="w-full px-3 py-2 border border-solar-300 rounded-lg focus:ring-2 focus:ring-solar-500 focus:border-transparent mb-3"
                placeholder="e.g., 100000000000000000 (0.1 ETH)"
              />
              <button className="w-full px-4 py-2 bg-solar-gradient text-white rounded-lg font-semibold hover:shadow-lg transition" onClick={updateDefaultPrice}>
                💾 Update Default Price
              </button>
            </div>

            {/* Status Message */}
            {msg && (
              <div className={`p-3 rounded-lg text-sm font-medium ${
                msg.includes('Error') || msg.includes('Failed')
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-green-100 text-green-700 border border-green-300'
              }`}>
                {msg}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
