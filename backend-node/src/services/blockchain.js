import { ethers } from "ethers";
import dotenv from "dotenv";
import abi from "../abi/SolarEnergyCertificate.json" assert { type: "json" };

dotenv.config();

// ---- Load ENV ----
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.error("❌ ERROR: Missing RPC_URL, PRIVATE_KEY, or CONTRACT_ADDRESS in .env");
  process.exit(1);
}

// ---- Providers ----
const provider = new ethers.JsonRpcProvider(RPC_URL);

// ---- Wallet ----
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// ---- Contract Instance ----
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  abi,
  wallet
);

export default contract;
