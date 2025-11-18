// src/components/ProtectedRoute.jsx
import React from "react";
import useContract from "../hooks/useContract";

export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { connected, role, connectWallet } = useContract();

  if (!connected)
    return (
      <div className="p-6">
        <h2 className="text-xl mb-4">Wallet Required</h2>
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Connect Wallet
        </button>
      </div>
    );

  if (!role) return <div className="p-6">Detecting role…</div>;

  // if allowedRoles is null -> this route is public (no role restriction)
  if (!allowedRoles) return children;

  if (!allowedRoles.includes(role))
    return (
      <div className="p-6 text-red-600 text-lg">
        ❌ Access Denied<br />
        Your role <b>{role}</b> is not allowed here.
      </div>
    );

  return children;
}
