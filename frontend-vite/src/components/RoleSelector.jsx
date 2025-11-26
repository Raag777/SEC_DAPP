// src/components/RoleSelector.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLE_KEY = "sec_role_v1";

// Role to route mapping
const ROLE_ROUTES = {
  guest: "/",
  admin: "/admin",
  producer: "/producers",
  company: "/companies",
};

export default function RoleSelector({ onChange }) {
  const [role, setRole] = useState(localStorage.getItem(ROLE_KEY) || "guest");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
    if (onChange) onChange(role);
  }, [role, onChange]);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);

    // Navigate to the corresponding page
    const route = ROLE_ROUTES[newRole] || "/";
    navigate(route);
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium">Role:</label>
      <select
        className="px-3 py-1 border rounded"
        value={role}
        onChange={handleRoleChange}
      >
        <option value="guest">Guest</option>
        <option value="admin">Admin</option>
        <option value="producer">Producer</option>
        <option value="company">Company</option>
      </select>
    </div>
  );
}
