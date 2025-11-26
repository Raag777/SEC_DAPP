// backend-node/src/services/admin.service.js
import { contractRO, contractRW } from "./blockchain.js";
import { isAddress } from "../utils/validation.js";

function ensureContractRW() {
  if (!contractRW) {
    throw new Error("Backend wallet not configured. Check PRIVATE_KEY in .env");
  }
}

export const listProducersService = async () => {
  const list = await contractRO.producers();
  return { producers: list };
};

export const listCompaniesService = async () => {
  const list = await contractRO.companies();
  return { companies: list };
};

export const registerProducerService = async (address) => {
  ensureContractRW();
  if (!isAddress(address)) throw new Error("Invalid address");
  const tx = await contractRW.registerProducer(address);
  const receipt = await tx.wait();
  const list = await contractRO.producers();
  return {
    message: "Producer registered",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed?.toString?.() ?? null,
    producers: list,
  };
};

export const removeProducerService = async (address) => {
  ensureContractRW();
  if (!isAddress(address)) throw new Error("Invalid address");
  const tx = await contractRW.removeProducer(address);
  const receipt = await tx.wait();
  const list = await contractRO.producers();
  return {
    message: "Producer removed",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed?.toString?.() ?? null,
    producers: list,
  };
};

export const registerCompanyService = async (address) => {
  ensureContractRW();
  if (!isAddress(address)) throw new Error("Invalid address");
  const tx = await contractRW.registerCompany(address);
  const receipt = await tx.wait();
  const list = await contractRO.companies();
  return {
    message: "Company registered",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed?.toString?.() ?? null,
    companies: list,
  };
};

export const removeCompanyService = async (address) => {
  ensureContractRW();
  if (!isAddress(address)) throw new Error("Invalid address");
  const tx = await contractRW.removeCompany(address);
  const receipt = await tx.wait();
  const list = await contractRO.companies();
  return {
    message: "Company removed",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed?.toString?.() ?? null,
    companies: list,
  };
};

export const setMinEnergyService = async (minEnergyWh) => {
  ensureContractRW();
  const tx = await contractRW.setMinEnergyWh(minEnergyWh);
  const receipt = await tx.wait();
  return {
    message: "Min energy updated",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
  };
};

export const setDefaultPriceService = async (priceWei) => {
  ensureContractRW();
  const tx = await contractRW.setDefaultPriceWei(priceWei);
  const receipt = await tx.wait();
  return {
    message: "Default price updated",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
  };
};
