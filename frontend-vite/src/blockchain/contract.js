// frontend-vite/src/blockchain/contract.js
import { ethers } from "ethers";
import solarAbi from "@/abi/SolarEnergyCertificate.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not detected");
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, solarAbi, signer);
  return { provider, signer, address, contract };
}

export async function getReadOnlyContract() {
  const url = import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(url);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, solarAbi, provider);
  return { provider, contract };
}
