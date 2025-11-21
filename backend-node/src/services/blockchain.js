import { ethers } from "ethers";
import dotenv from "dotenv";
import solarABI from "../abi/SolarEnergyCertificate.json" assert { type: "json" };

dotenv.config();

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Provider (read-only)
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Wallet + signer (write-enabled)
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Read-only contract
export const contractRO = new ethers.Contract(
    CONTRACT_ADDRESS,
    solarABI,
    provider
);

// Read-write contract
export const contractRW = new ethers.Contract(
    CONTRACT_ADDRESS,
    solarABI,
    wallet
);

// Default export (optional, for legacy code)
export default contractRW;
