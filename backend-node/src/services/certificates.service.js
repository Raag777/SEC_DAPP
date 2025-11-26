// backend-node/src/services/certificates.service.js
import { contractRO, contractRW, getContractForProducer } from "./blockchain.js";
import { isAddress } from "../utils/validation.js";

function ensureContractRW() {
  if (!contractRW) {
    throw new Error("Backend wallet not configured. Check PRIVATE_KEY in .env");
  }
}

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

export const purchaseCertificateService = async (id, valueWei, companyAddress) => {
  if (!companyAddress || !isAddress(companyAddress)) {
    throw new Error("Invalid company address");
  }

  // Get contract instance for the specific company (buyer)
  const companyContract = getContractForProducer(companyAddress); // Note: using same function, works for any address

  const tx = await companyContract.purchaseCertificate(Number(id), { value: BigInt(valueWei) });
  const receipt = await tx.wait();
  return {
    message: "Certificate purchased",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed?.toString?.() ?? null,
  };
};

export const retireCertificateService = async (id, retireByAddress) => {
  // If retireByAddress is provided, use that specific account
  let contract;
  if (retireByAddress && isAddress(retireByAddress)) {
    contract = getContractForProducer(retireByAddress);
  } else {
    ensureContractRW();
    contract = contractRW;
  }

  const tx = await contract.retireCertificate(Number(id));
  const receipt = await tx.wait();
  return {
    message: "Certificate retired",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
  };
};

export const getAllCertificatesService = async () => {
  // Get total number of certificates
  const totalCerts = await contractRO.certificateCounter();
  const total = Number(totalCerts);

  // Get producers and companies lists for labeling
  const producers = await contractRO.getProducers();
  const companies = await contractRO.getCompanies();

  const certificates = [];

  // Fetch all certificates
  for (let id = 1; id <= total; id++) {
    try {
      const c = await contractRO.getCertificate(id);
      const cert = {
        id: Number(c[0]),
        owner: c[1],
        energyWh: Number(c[2]),
        timestamp: Number(c[3]),
        retired: Boolean(c[4]),
        issuer: c[5],
        priceWei: String(c[6]),
      };

      // Determine certificate label
      let certLabel = `ID${cert.id}`;
      let ownerType = "Unknown";

      const producerIndex = producers.findIndex(p => p.toLowerCase() === cert.owner.toLowerCase());
      if (producerIndex !== -1) {
        ownerType = "Producer";
        certLabel = `P${producerIndex + 1}_ID${cert.id}`;
      } else {
        const companyIndex = companies.findIndex(c => c.toLowerCase() === cert.owner.toLowerCase());
        if (companyIndex !== -1) {
          ownerType = "Company";
          certLabel = `C${companyIndex + 1}_ID${cert.id}`;
        }
      }

      cert.label = certLabel;
      cert.ownerType = ownerType;

      certificates.push(cert);
    } catch (err) {
      console.warn(`Failed to fetch certificate ${id}:`, err.message);
    }
  }

  return { certificates, total };
};
