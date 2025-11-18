import React, { useState, useEffect } from "react";
import useContract from "../hooks/useContract";
import axios from "axios";

const ROLE_OVERRIDE_KEY = "sec_role_overrides_v1";
const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function RoleManager() {
  const { walletAddress, role, connected } = useContract();
  const [selected, setSelected] = useState(role || "company");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelected(role || "company");
  }, [role]);

  if (!connected || !walletAddress) return null;

  function saveLocalOverride() {
    const raw = localStorage.getItem(ROLE_OVERRIDE_KEY);
    const map = raw ? JSON.parse(raw) : {};

    map[walletAddress.toLowerCase()] = selected;
    localStorage.setItem(ROLE_OVERRIDE_KEY, JSON.stringify(map));

    alert(`Local override saved as "${selected}". Reloading…`);
    setTimeout(() => window.location.reload(), 400);
  }

  async function saveServerRole() {
    if (!walletAddress) return alert("Wallet not detected.");

    try {
      setSaving(true);
      const res = await axios.post(`${BACKEND}/register`, {
        address: walletAddress,
        role: selected,
      });

      if (res.data?.ok) {
        alert(`Backend role saved as "${selected}". Reloading…`);
        setTimeout(() => window.location.reload(), 500);
      } else {
        alert("Failed to save role on backend");
      }
    } catch (err) {
      alert("Error saving role: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  function clearLocalOverride() {
    const raw = localStorage.getItem(ROLE_OVERRIDE_KEY);
    if (!raw) return alert("No existing override to clear.");

    const map = JSON.parse(raw);
    delete map[walletAddress.toLowerCase()];

    localStorage.setItem(ROLE_OVERRIDE_KEY, JSON.stringify(map));
    alert("Local override cleared.\nReloading…");
    setTimeout(() => window.location.reload(), 400);
  }

  return (
    <div className="p-4 border rounded-md bg-gray-100 dark:bg-gray-900 text-sm mt-6">
      <div className="font-semibold mb-2">🔐 Role Manager (Dev Mode)</div>

      <div className="text-xs">Wallet: <b>{walletAddress}</b></div>
      <div className="text-xs mb-3">Current Role Detected: <b>{role}</b></div>

      <label className="block mb-3">
        Select role:
        <select
          className="border p-1 rounded mt-1 w-full"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="producer">Producer</option>
          <option value="company">Company</option>
        </select>
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={saveLocalOverride}
          className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
        >
          Save Local
        </button>

        <button
          onClick={saveServerRole}
          className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Server"}
        </button>

        <button
          onClick={clearLocalOverride}
          className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
        >
          Clear Local
        </button>
      </div>
    </div>
  );
}
