// frontend-vite/src/blockchain/contract.js
import { ethers } from "ethers";
import abi from "@/abi/SolarEnergyCertificate.json";

const VITE_RPC = import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545";
const VITE_CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export function getProvider() {
  // If MetaMask is available, prefer it for signing/txs
  if (window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  // fallback to RPC
  return new ethers.JsonRpcProvider(VITE_RPC);
}

export function getContract(signerOrProvider = null) {
  const provider = signerOrProvider || getProvider();
  if (!VITE_CONTRACT) {
    throw new Error("VITE_CONTRACT_ADDRESS not set in .env");
  }
  return new ethers.Contract(VITE_CONTRACT, abi, provider);
}
