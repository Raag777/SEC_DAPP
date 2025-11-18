// src/context/ContractProvider.jsx
import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import axios from "axios";
import abi from "../abi/SolarCertificate.json";
import { ContractContext } from "./ContractContext";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

// **Local Storage Key for Role Overrides**
const ROLE_OVERRIDE_KEY = "sec_role_overrides_v1";

export default function ContractProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState(null);
  const [connected, setConnected] = useState(false);

  // ------------------------------------------------------
  // READ ROLE OVERRIDE FROM LOCAL STORAGE
  // ------------------------------------------------------
  const readLocalOverride = (addr) => {
    try {
      const raw = localStorage.getItem(ROLE_OVERRIDE_KEY);
      if (!raw || !addr) return null;

      const map = JSON.parse(raw);
      return map[addr.toLowerCase()] || null;
    } catch {
      return null;
    }
  };

  // ------------------------------------------------------
  // CONNECT WALLET
  // ------------------------------------------------------
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) return alert("MetaMask not detected!");

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const addr = accounts?.[0]?.toLowerCase();
      if (!addr) return;

      const prov = new ethers.BrowserProvider(window.ethereum);
      const s = await prov.getSigner();

      setProvider(prov);
      setSigner(s);
      setWalletAddress(addr);
      setConnected(true);

      const c = new ethers.Contract(CONTRACT_ADDRESS, abi, s);
      setContract(c);

      // 1️⃣ CHECK ROLE OVERRIDE FIRST
      const override = readLocalOverride(addr);
      if (override) {
        setRole(override);
        return;
      }

      // 2️⃣ CHECK ROLE FROM SMART CONTRACT
      try {
        const isAdmin = await c.isAdmin(addr);
        if (isAdmin) {
          setRole("admin");
          return;
        }

        const isProducer = await c.isProducer(addr);
        if (isProducer) {
          setRole("producer");
          return;
        }

        // 3️⃣ FALLBACK: BACKEND CHECK FOR PRODUCER TOKENS
        const res = await axios.get(`${BACKEND}/tokensOfOwner/${addr}`).catch(() => null);
        const tokens = res?.data?.tokens || [];

        setRole(tokens.length > 0 ? "producer" : "company");
      } catch (err) {
        console.warn("Role detection failed:", err);
        setRole("company");
      }
    } catch (err) {
      console.error("connectWallet error:", err);
      setConnected(false);
    }
  }, []);

  // ------------------------------------------------------
  // DISCONNECT
  // ------------------------------------------------------
  const disconnect = useCallback(() => {
    setWalletAddress(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setRole(null);
    setConnected(false);
  }, []);

  // ------------------------------------------------------
  // AUTO CONNECT IF WALLET ALREADY CONNECTED
  // ------------------------------------------------------
  useEffect(() => {
    (async () => {
      if (!window.ethereum) return;

      try {
        const prov = new ethers.BrowserProvider(window.ethereum);
        const accounts = await prov.listAccounts();

        if (accounts?.length > 0) {
          const addr = accounts[0].address.toLowerCase();

          setProvider(prov);
          setSigner(await prov.getSigner());
          setWalletAddress(addr);
          setConnected(true);

          const c = new ethers.Contract(CONTRACT_ADDRESS, abi, await prov.getSigner());
          setContract(c);

          // check override
          const override = readLocalOverride(addr);
          if (override) {
            setRole(override);
            return;
          }

          // smart contract role
          try {
            const isAdmin = await c.isAdmin(addr);
            if (isAdmin) {
              setRole("admin");
              return;
            }

            const isProducer = await c.isProducer(addr);
            if (isProducer) {
              setRole("producer");
              return;
            }

            const res = await axios.get(`${BACKEND}/tokensOfOwner/${addr}`).catch(() => null);
            const tokens = res?.data?.tokens || [];

            setRole(tokens.length > 0 ? "producer" : "company");
          } catch {
            setRole("company");
          }
        }
      } catch (e) {
        // ignore silent errors
      }
    })();
  }, []);

  // ------------------------------------------------------
  // LISTEN TO ACCOUNT & NETWORK CHANGE
  // ------------------------------------------------------
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccounts = (accounts) => {
      if (!accounts || accounts.length === 0)
        return disconnect();

      const addr = accounts[0].toLowerCase();

      setWalletAddress(addr);
      setConnected(true);

      // check override quickly
      const override = readLocalOverride(addr);
      if (override) {
        setRole(override);
        return;
      }

      setRole(null); // trigger re-detect
    };

    window.ethereum.on("accountsChanged", handleAccounts);
    window.ethereum.on("chainChanged", () => window.location.reload());

    return () => {
      try {
        window.ethereum.removeListener("accountsChanged", handleAccounts);
      } catch {}
    };
  }, [disconnect]);

  // ------------------------------------------------------
  // CONTEXT VALUE
  // ------------------------------------------------------
  const value = {
    walletAddress,
    provider,
    signer,
    contract,
    role,
    connected,
    connectWallet,
    disconnect,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}
