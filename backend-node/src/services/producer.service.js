// backend-node/src/services/producer.service.js
import { contractRW, contractRO, getContractForProducer } from "./blockchain.js";
import { isAddress } from "../utils/validation.js";

function ensureContractRW() {
  if (!contractRW) {
    throw new Error("Backend wallet not configured. Check PRIVATE_KEY in .env");
  }
}

export const setProducerPriceService = async (producerAddr, priceWei) => {
  if (!isAddress(producerAddr)) throw new Error("Invalid producer address");

  // Get contract instance for the specific producer
  const producerContract = getContractForProducer(producerAddr);

  const tx = await producerContract.setProducerPrice(priceWei);
  const receipt = await tx.wait();
  return {
    message: "Price updated",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
  };
};

export const issueCertificateService = async (ownerAddr, energyWh, producerAddr) => {
  if (!isAddress(ownerAddr)) throw new Error("Invalid owner address");
  if (!producerAddr || !isAddress(producerAddr)) throw new Error("Invalid producer address");

  // Get contract instance for the specific producer
  const producerContract = getContractForProducer(producerAddr);

  const tx = await producerContract.issueCertificate(ownerAddr, energyWh);
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
