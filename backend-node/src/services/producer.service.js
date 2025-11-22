// backend-node/src/services/producer.service.js
import { contractRW, contractRO } from "./blockchain.js";
import { isAddress } from "../utils/validation.js";

export const setProducerPriceService = async (producerAddr, priceWei) => {
  if (!isAddress(producerAddr)) throw new Error("Invalid producer address");
  // only producer can call setProducerPrice (on-chain). Here we expect the signer in contractRW to be the producer.
  const tx = await contractRW.setProducerPrice(priceWei);
  const receipt = await tx.wait();
  return {
    message: "Price updated",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
  };
};

export const issueCertificateService = async (ownerAddr, energyWh) => {
  if (!isAddress(ownerAddr)) throw new Error("Invalid owner address");
  const tx = await contractRW.issueCertificate(ownerAddr, energyWh);
  const receipt = await tx.wait();

  // Next id is incremented after issue; fetch nextId and deduce newest id as nextId-1
  const nextIdBN = await contractRO.nextId();
  const issuedId = Number(nextIdBN) - 1;

  return {
    message: "Certificate issued",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    certificateId: issuedId,
  };
};

export const myCertificatesService = async (ownerAddr) => {
  const ids = await contractRO.certificatesOfOwner(ownerAddr);
  return { certificates: ids.map((i) => Number(i)) };
};
