// backend-node/src/services/blockchain.js
import dotenv from "dotenv";
import { ethers } from "ethers";
import solarABI from "../abi/SolarEnergyCertificate.json" assert { type: "json" };

dotenv.config();

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";     // admin / deployer key for write txs
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

if (!RPC_URL) throw new Error("Missing RPC_URL in .env");

// provider
export const provider = new ethers.JsonRpcProvider(RPC_URL);

// Read-only contract (no signer)
export const contractRO = new ethers.Contract(CONTRACT_ADDRESS, solarABI, provider);

// Write contract (wallet signer) — only if PRIVATE_KEY provided
export let contractRW;
export let wallet;

if (PRIVATE_KEY && PRIVATE_KEY.length > 10) {
  wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  contractRW = new ethers.Contract(CONTRACT_ADDRESS, solarABI, wallet);
} else {
  // keep contractRW undefined to force developer to set PRIVATE_KEY
  contractRW = null;
}

// Default export (convenience)
export default { provider, contractRO, contractRW, wallet };
