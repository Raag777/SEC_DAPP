import { ethers } from "ethers";
import { contractRW, contractRO } from "../services/blockchain.js";
import { isAddress } from "../utils/validation.js";

export const issueCertificateService = async (address, energyWh) => {
    if (!isAddress(address)) throw new Error("Invalid address");

    const tx = await contractRW.issueCertificate(address, energyWh);
    const receipt = await tx.wait();

    return {
        message: "Certificate issued",
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
    };
};

export const setProducerPriceService = async (priceWei) => {
    const tx = await contractRW.setProducerPrice(priceWei);
    const receipt = await tx.wait();

    return {
        message: "Price updated for producer",
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
    };
};
