// backend-node/src/utils/validation.js
import { isAddress as ethersIsAddress } from "ethers";

export function isAddress(addr) {
  if (!addr || typeof addr !== "string") return false;
  try {
    // ethers v6: will throw on invalid checksum sometimes, so use basic test
    return ethersIsAddress(addr);
  } catch {
    return false;
  }
}
