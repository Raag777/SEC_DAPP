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
  const [addr, setAddr] = useState("");
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
    if (!addr) return setMsg("Enter address");
    setMsg("");
    try {
      await api.post("/admin/registerProducer", { address: addr });
      setMsg("Producer registered");
      setAddr("");
      fetchLists();
    } catch (e) {
      setMsg("Error: " + (e?.response?.data?.error || e.message));
    }
  }

  async function removeProducer() {
    if (!addr) return setMsg("Enter address");
    setMsg("");
    try {
      await api.post("/admin/removeProducer", { address: addr });
      setMsg("Producer removed");
      setAddr("");
      fetchLists();
    } catch (e) {
      setMsg("Error: " + (e?.response?.data?.error || e.message));
    }
  }

  async function registerCompany() {
    if (!addr) return setMsg("Enter address");
    setMsg("");
    try {
      await api.post("/admin/registerCompany", { address: addr });
      setMsg("Company registered");
      setAddr("");
      fetchLists();
    } catch (e) {
      setMsg("Error: " + (e?.response?.data?.error || e.message));
    }
  }

  async function removeCompany() {
    if (!addr) return setMsg("Enter address");
    setMsg("");
    try {
      await api.post("/admin/removeCompany", { address: addr });
      setMsg("Company removed");
      setAddr("");
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <RoleSelector onChange={(r)=>setRole(r)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-3">Producer / Company Management</h2>
          <p className="text-sm text-gray-500 mb-3">Register or remove addresses (on-chain via backend/contract).</p>

          <div className="flex gap-3">
            <input className="flex-1 border p-2 rounded" placeholder="0x..." value={addr} onChange={(e)=>setAddr(e.target.value)} />
            <Button className="bg-green-600" onClick={registerProducer}>Register Producer</Button>
            <Button className="bg-red-600" onClick={removeProducer}>Remove Producer</Button>
          </div>

          <div className="mt-3 flex gap-3">
            <input className="flex-1 border p-2 rounded" placeholder="0x..." value={addr} onChange={(e)=>setAddr(e.target.value)} />
            <Button className="bg-green-600" onClick={registerCompany}>Register Company</Button>
            <Button className="bg-red-600" onClick={removeCompany}>Remove Company</Button>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Producers</h3>
            {loading ? <p>Loading...</p> : (
              <ul className="mt-2 space-y-1 text-sm">
                {producers.length === 0 ? <li className="text-gray-500">No producers</li> :
                  producers.map(p => <li key={p} className="font-mono">{p}</li>)
                }
              </ul>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Companies</h3>
            {loading ? <p>Loading...</p> : (
              <ul className="mt-2 space-y-1 text-sm">
                {companies.length === 0 ? <li className="text-gray-500">No companies</li> :
                  companies.map(c => <li key={c} className="font-mono">{c}</li>)
                }
              </ul>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-3">Policies</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Minimum energy (Wh)</label>
              <input value={minEnergy} onChange={(e)=>setMinEnergy(e.target.value)} className="w-full border p-2 rounded" placeholder="e.g., 1000" />
              <div className="mt-2">
                <Button onClick={updateMinEnergy}>Update Min Energy</Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Default Price (wei)</label>
              <input value={defaultPrice} onChange={(e)=>setDefaultPrice(e.target.value)} className="w-full border p-2 rounded" placeholder="e.g., 100000000000000000 (0.1 ETH in wei)" />
              <div className="mt-2">
                <Button onClick={updateDefaultPrice}>Update Default Price</Button>
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-2">{msg}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
