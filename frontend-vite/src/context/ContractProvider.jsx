// frontend-vite/src/context/ContractProvider.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import abi from "@/abi/SolarEnergyCertificate.json"; // ensure file exists
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ContractContext = createContext(null);

export function useContract() {
  return useContext(ContractContext);
}

export default function ContractProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [role, setRole] = useState(null);

  // connect MetaMask
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) return alert("MetaMask not found. Install MetaMask or use a Web3 provider.");
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const addr = accounts[0].toLowerCase();
      const p = new ethers.BrowserProvider(window.ethereum);
      const s = await p.getSigner();
      const c = new ethers.Contract(CONTRACT_ADDRESS, abi, s);

      setProvider(p);
      setSigner(s);
      setContract(c);
      setWalletAddress(addr);
      setConnected(true);
    } catch (e) {
      console.error("connectWallet err", e);
      setConnected(false);
    }
  }, []);

  // auto connect if already connected
  useEffect(() => {
    (async () => {
      if (!window.ethereum) return;
      try {
        const p = new ethers.BrowserProvider(window.ethereum);
        const accounts = await p.listAccounts();
        if (accounts.length) {
          const s = await p.getSigner();
          const c = new ethers.Contract(CONTRACT_ADDRESS, abi, s);
          setProvider(p);
          setSigner(s);
          setContract(c);
          setWalletAddress(accounts[0].toLowerCase());
          setConnected(true);
        }
      } catch (e) { /* silent */ }
    })();
  }, []);

  // listen to account change
  useEffect(() => {
    if (!window.ethereum) return;
    const handler = (accounts) => {
      if (!accounts || accounts.length === 0) {
        setWalletAddress(null);
        setConnected(false);
        setContract(null);
        setSigner(null);
        return;
      }
      setWalletAddress(accounts[0].toLowerCase());
      setConnected(true);
      // re-create contract quickly:
      (async () => {
        const p = new ethers.BrowserProvider(window.ethereum);
        setProvider(p);
        setSigner(await p.getSigner());
        setContract(new ethers.Contract(CONTRACT_ADDRESS, abi, await p.getSigner()));
      })();
    };
    window.ethereum.on("accountsChanged", handler);
    window.ethereum.on("chainChanged", () => window.location.reload());
    return () => {
      try { window.ethereum.removeListener("accountsChanged", handler); } catch {}
    };
  }, []);

  // Helpful helper methods (on-chain)
  async function registerProducerAddress(addressToRegister) {
    if (!contract || !signer) throw new Error("Connect wallet first");
    const tx = await contract.registerProducer(addressToRegister);
    const receipt = await tx.wait?.();
    return receipt || tx;
  }

  async function removeProducerAddress(addressToRemove) {
    if (!contract || !signer) throw new Error("Connect wallet first");
    const tx = await contract.removeProducer(addressToRemove);
    const receipt = await tx.wait?.();
    return receipt || tx;
  }

  async function issueCertificateOnChain(ownerAddress, energy_kWh) {
    if (!contract || !signer) throw new Error("Connect wallet first");
    // contract expects energy in kWh or energy units? in our solidity it used kWh stored directly.
    const tx = await contract.issueCertificate(ownerAddress, ethers.parseUnits(String(energy_kWh), 0));
    const receipt = await tx.wait?.();
    return receipt || tx;
  }

  async function verifyCertificateOnChain(id) {
    if (!contract) throw new Error("Contract not initialized");
    const c = await contract.verifyCertificate(id);
    // returns tuple (id, owner, energyProduced, timestamp, retired)
    return {
      id: Number(c[0]),
      owner: c[1],
      energyProduced: Number(c[2]),
      timestamp: Number(c[3]),
      retired: Boolean(c[4]),
    };
  }

  const value = {
    provider,
    signer,
    contract,
    walletAddress,
    connected,
    role,
    connectWallet,
    registerProducerAddress,
    removeProducerAddress,
    issueCertificateOnChain,
    verifyCertificateOnChain,
    setRole,
  };

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
}
