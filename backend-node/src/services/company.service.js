import { contractRW, contractRO } from "../services/blockchain.js";
import { isAddress } from "../utils/validation.js";

function ensureContractRW() {
  if (!contractRW) {
    throw new Error("Backend wallet not configured. Check PRIVATE_KEY in .env");
  }
}

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
        companies: list
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
        companies: list
    };
};

export const listCompaniesService = async () => {
    const list = await contractRO.companies();
    return { companies: list };
};

export const isCompanyService = async (address) => {
    if (!isAddress(address)) throw new Error("Invalid address");

    const flag = await contractRO.isCompany(address);
    return { address, isCompany: flag };
};
