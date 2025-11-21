import { ethers } from "ethers";

export const isAddress = (addr) => {
    try {
        return ethers.isAddress(addr);
    } catch {
        return false;
    }
};
