// frontend-vite/src/pages/AdminMint.jsx
import React, { useState, useEffect } from "react";
import { useContract } from "@/context/ContractProvider";
import Button from "@/components/ui/Button";

export default function AdminMint() {
  const { connectWallet, walletAddress, connected, registerProducerAddress, removeProducerAddress, contract } = useContract();
  const [producerAddr, setProducerAddr] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister() {
    try {
      if (!producerAddr) return alert("Enter an address");
      setMessage("Sending tx...");
      await registerProducerAddress(producerAddr);
      setMessage("Registered successfully.");
    } catch (e) {
      console.error(e);
      setMessage("Error: " + (e?.message || e));
    }
  }

  async function handleRemove() {
    try {
      if (!producerAddr) return alert("Enter an address");
      setMessage("Sending removal tx...");
      await removeProducerAddress(producerAddr);
      setMessage("Removed successfully.");
    } catch (e) {
      console.error(e);
      setMessage("Error: " + (e?.message || e));
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel — Producers</h1>

      <div className="mb-4">
        {!connected ? (
          <Button onClick={connectWallet}>Connect MetaMask</Button>
        ) : (
          <div className="text-sm">Connected: <code>{walletAddress}</code></div>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow max-w-2xl">
        <label className="block text-sm mb-2">Producer Address</label>
        <input value={producerAddr} onChange={(e) => setProducerAddr(e.target.value)} placeholder="0x..." className="w-full p-2 border rounded mb-3" />
        <div className="flex gap-3">
          <Button onClick={handleRegister}>Register Producer (on-chain)</Button>
          <Button className="bg-red-600" onClick={handleRemove}>Remove Producer</Button>
        </div>
        <div className="mt-3 text-sm text-gray-600">{message}</div>
      </div>
    </div>
  );
}
