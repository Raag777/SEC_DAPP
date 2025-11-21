// src/components/RoleSelector.jsx
import React, { useEffect, useState } from "react";

const ROLE_KEY = "sec_role_v1";

export default function RoleSelector({ onChange }) {
  const [role, setRole] = useState(localStorage.getItem(ROLE_KEY) || "guest");

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
    if (onChange) onChange(role);
  }, [role, onChange]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium">Role:</label>
      <select
        className="px-3 py-1 border rounded"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="guest">Guest</option>
        <option value="admin">Admin</option>
        <option value="producer">Producer</option>
        <option value="company">Company</option>
      </select>
    </div>
  );
}
