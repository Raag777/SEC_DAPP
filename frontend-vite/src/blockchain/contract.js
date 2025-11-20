import { ethers } from "ethers";
import contractABI from "../abi/SolarEnergyCertificate.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your deployed address

let provider;
let signer;
let contract;

export async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not installed!");
    return null;
  }

  provider = new ethers.BrowserProvider(window.ethereum);

  const accounts = await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  console.log("Connected Wallet:", accounts[0]);

  contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI.abi, // ABI
    signer
  );

  return accounts[0];
}

export function getContract() {
  if (!contract) throw new Error("Wallet not connected!");
  return contract;
}
