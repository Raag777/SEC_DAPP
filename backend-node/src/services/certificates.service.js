// backend-node/src/services/certificates.service.js
import { contractRO, contractRW } from "./blockchain.js";
import { isAddress } from "../utils/validation.js";

export const getCertificateService = async (id) => {
  const data = await contractRO.getCertificate(Number(id));
  // returns tuple (id, owner, energyWh, timestamp, retired, issuer, priceWei)
  return {
    id: Number(data[0]),
    owner: data[1],
    energyWh: Number(data[2]),
    timestamp: Number(data[3]),
    retired: data[4],
    issuer: data[5],
    priceWei: data[6].toString(),
  };
};

export const certificatesOfOwnerService = async (owner) => {
  if (!isAddress(owner)) throw new Error("Invalid address");
  const ids = await contractRO.certificatesOfOwner(owner);
  return { certificates: ids.map((i) => Number(i)) };
};

export const purchaseCertificateService = async (id, valueWei) => {
  // buyer must sign the tx; backend can act as orchestrator if it holds a buyer private key.
  const tx = await contractRW.purchaseCertificate(Number(id), { value: BigInt(valueWei) });
  const receipt = await tx.wait();
  return {
    message: "Certificate purchased",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed?.toString?.() ?? null,
  };
};

export const retireCertificateService = async (id) => {
  const tx = await contractRW.retireCertificate(Number(id));
  const receipt = await tx.wait();
  return {
    message: "Certificate retired",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
  };
};
