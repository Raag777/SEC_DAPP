import { ethers } from "ethers";
import { contractRW, contractRO } from "../services/blockchain.js";

export const issueCertificateService = async (address, energyWh) => {
    const tx = await contractRW.issueCertificate(address, energyWh);
    const receipt = await tx.wait();
    return {
        message: "Certificate issued",
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
    };
};

export const purchaseCertificateService = async (id, priceWei) => {
    const tx = await contractRW.purchaseCertificate(id, { value: priceWei });
    const receipt = await tx.wait();
    return {
        message: "Certificate purchased",
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
    };
};

export const retireCertificateService = async (id) => {
    const tx = await contractRW.retireCertificate(id);
    const receipt = await tx.wait();
    return {
        message: "Certificate retired",
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
    };
};
