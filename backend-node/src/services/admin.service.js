import { ethers } from "ethers";
import { contractRW, contractRO } from "./blockchain.js";
import { isAddress } from "../utils/validation.js";

// ------- LISTS -------
export const listProducersService = async () => {
    return await contractRO.producerList();
};

export const listCompaniesService = async () => {
    return await contractRO.companyList();
};

// ------- PRODUCER -------
export const registerProducerService = async (address) => {
    if (!isAddress(address)) throw new Error("Invalid address");

    const tx = await contractRW.registerProducer(address);
    const receipt = await tx.wait();

    return {
        success: true,
        txHash: receipt.transactionHash,
        producers: await contractRO.producerList()
    };
};

export const removeProducerService = async (address) => {
    if (!isAddress(address)) throw new Error("Invalid address");

    const tx = await contractRW.removeProducer(address);
    const receipt = await tx.wait();

    return {
        success: true,
        txHash: receipt.transactionHash,
        producers: await contractRO.producerList()
    };
};

// ------- COMPANY -------
export const registerCompanyService = async (address) => {
    if (!isAddress(address)) throw new Error("Invalid address");

    const tx = await contractRW.registerCompany(address);
    const receipt = await tx.wait();

    return {
        success: true,
        txHash: receipt.transactionHash,
        companies: await contractRO.companyList()
    };
};

export const removeCompanyService = async (address) => {
    if (!isAddress(address)) throw new Error("Invalid address");

    const tx = await contractRW.removeCompany(address);
    const receipt = await tx.wait();

    return {
        success: true,
        txHash: receipt.transactionHash,
        companies: await contractRO.companyList()
    };
};

// ------- POLICY -------
export const setMinEnergyService = async (minEnergyWh) => {
    const tx = await contractRW.setMinEnergyWh(minEnergyWh);
    const receipt = await tx.wait();

    return { success: true, txHash: receipt.transactionHash };
};

export const setDefaultPriceService = async (priceWei) => {
    const tx = await contractRW.setDefaultPriceWei(priceWei);
    const receipt = await tx.wait();

    return { success: true, txHash: receipt.transactionHash };
};
