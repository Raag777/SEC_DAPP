import { ethers } from "ethers";
import { contractRW, contractRO } from "../services/blockchain.js";
import { isAddress } from "../utils/validation.js";

export const registerProducerService = async (address) => {
    if (!isAddress(address)) throw new Error("Invalid address");

    const tx = await contractRW.registerProducer(address);
    const receipt = await tx.wait();
    const producerList = await contractRO.producers();

    return {
        message: "Producer registered",
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        producers: producerList
    };
};

export const removeProducerService = async (address) => {
    if (!isAddress(address)) throw new Error("Invalid address");

    const tx = await contractRW.removeProducer(address);
    const receipt = await tx.wait();
    const producerList = await contractRO.producers();

    return {
        message: "Producer removed",
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        producers: producerList
    };
};
