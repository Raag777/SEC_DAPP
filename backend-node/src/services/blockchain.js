import { ethers } from "ethers";
import dotenv from "dotenv";
import solarABI from "../abi/SolarEnergyCertificate.json" assert { type: "json" };

dotenv.config();

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  solarABI,
  wallet
);

export default contract;
