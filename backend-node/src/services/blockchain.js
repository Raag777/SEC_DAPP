// backend-node/src/services/blockchain.js
import dotenv from "dotenv";
import { ethers } from "ethers";
import solarABI from "../abi/SolarEnergyCertificate.json" with { type: "json" };

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

// ========== MULTI-PRODUCER SUPPORT ==========
// Hardhat test accounts (for development/demo)
// These are the default accounts from `npx hardhat node`
const HARDHAT_ACCOUNTS = [
  { address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" },
  { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", key: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" },
  { address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", key: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a" },
  { address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", key: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6" },
  { address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", key: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a" },
  { address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", key: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba" },
  { address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9", key: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e" },
  { address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", key: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356" },
  { address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", key: "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97" },
  { address: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", key: "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6" }
];

// Cache for wallets/contracts by producer address
const producerWallets = new Map();
const producerContracts = new Map();

/**
 * Get or create a contract instance for a specific producer address
 * @param {string} producerAddress - The producer's address
 * @returns {ethers.Contract} Contract instance signed by the producer
 */
export function getContractForProducer(producerAddress) {
  const addr = producerAddress.toLowerCase();

  // Check cache
  if (producerContracts.has(addr)) {
    return producerContracts.get(addr);
  }

  // Find the producer's private key
  const account = HARDHAT_ACCOUNTS.find(acc => acc.address.toLowerCase() === addr);

  if (!account) {
    throw new Error(`No private key found for producer ${producerAddress}. Add it to HARDHAT_ACCOUNTS in blockchain.js`);
  }

  // Create wallet and contract
  const producerWallet = new ethers.Wallet(account.key, provider);
  const producerContract = new ethers.Contract(CONTRACT_ADDRESS, solarABI, producerWallet);

  // Cache for future use
  producerWallets.set(addr, producerWallet);
  producerContracts.set(addr, producerContract);

  return producerContract;
}

/**
 * Get wallet for a specific producer address
 * @param {string} producerAddress - The producer's address
 * @returns {ethers.Wallet} Wallet instance for the producer
 */
export function getWalletForProducer(producerAddress) {
  const addr = producerAddress.toLowerCase();

  if (producerWallets.has(addr)) {
    return producerWallets.get(addr);
  }

  // Trigger contract creation which also creates wallet
  getContractForProducer(producerAddress);
  return producerWallets.get(addr);
}

// Default export (convenience)
export default { provider, contractRO, contractRW, wallet, getContractForProducer, getWalletForProducer };
