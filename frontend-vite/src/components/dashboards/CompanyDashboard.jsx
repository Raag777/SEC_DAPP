// src/components/dashboards/CompanyDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { fmt } from "../../utils/formatTimestamp";
import QR from "../../utils/QRGenerator";

export default function CompanyDashboard() {
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [certs, setCerts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadCerts() {
    setLoading(true);
    try {
      const res = await axios.get(`${backend}/certificates.json`);
      setCerts(res.data || []);
      setFiltered(res.data || []);
    } catch (e) {
      console.error("Error loading certificates:", e);
      setCerts([]);
      setFiltered([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCerts();
  }, []);

  function handleSearch(e) {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filteredList = certs.filter((c) =>
      String(c.id).includes(value) || (c.owner || "").toLowerCase().includes(value)
    );
    setFiltered(filteredList);
  }

  async function verifyCertificate(id) {
    try {
      const resp = await axios.get(`${backend}/getSEC/${id}`);
      if (resp.data?.id !== undefined) alert(`Certificate #${id} is VALID ✓`);
      else alert(`Certificate #${id} is INVALID ✗`);
    } catch (e) {
      alert(`Error verifying certificate #${id}`);
    }
  }

  return (
    <div className="p-6">
      <Card title="Search / Filter Certificates">
        <input
          type="text"
          placeholder="Search by ID or Producer Address"
          className="w-full p-2 border rounded mb-4"
          value={search}
          onChange={handleSearch}
        />
      </Card>

      <Card title="Verified Certificates List">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Available Certificates</h2>
          <Button onClick={loadCerts}>Refresh</Button>
        </div>

        {loading && <p className="text-gray-600">Loading certificates...</p>}
        {!loading && filtered.length === 0 && <p className="text-gray-600">No certificates match your search.</p>}

        <div className="overflow-auto max-h-[500px] border rounded mt-3">
          {filtered.map((c) => (
            <div key={c.id} className="border-b p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Certificate ID #{c.id} — {Math.round((c.energyWh || 0) / 1000)} kWh</p>
                <p className="text-xs text-gray-500">Producer: {c.owner}</p>
                <p className="text-xs text-gray-500">Timestamp: {fmt(c.timestamp)}</p>
                <Button className="bg-green-600 mt-2" onClick={() => verifyCertificate(c.id)}>Verify</Button>
              </div>

              <div className="flex flex-col items-end gap-2">
                <QR text={`${window.location.origin}/certificate/${c.id}`} size={80} />
                <a href={`${backend}/download_certificate/${c.id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
