// backend-node/src/services/merkleService.js
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import solarABI from "../abi/SolarEnergyCertificate.json" with { type: "json" };
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, solarABI, provider);

/**
 * Build merkle tree of CertificateIssued + CertificatePurchased events.
 * Leaves format: keccak256("LABEL|TXHASH")
 * LABEL examples:  P1_ID5, C2_ID7
 */
export async function buildMerkleTree(fromBlock = 0, toBlock = "latest") {
  // Fetch producers & companies
  const producers = (await contract.producers()).map((a) => a.toLowerCase());
  const companies = (await contract.companies()).map((a) => a.toLowerCase());

  const issueFilter = contract.filters.CertificateIssued();
  const purchaseFilter = contract.filters.CertificatePurchased();

  const issued = await contract.queryFilter(issueFilter, fromBlock, toBlock);
  const purchases = await contract.queryFilter(purchaseFilter, fromBlock, toBlock);

  const leaves = [];

  const findProducerIndex = (addr) => {
    const idx = producers.findIndex((p) => p === addr.toLowerCase());
    return idx >= 0 ? idx + 1 : 0;
  };

  const findCompanyIndex = (addr) => {
    const idx = companies.findIndex((p) => p === addr.toLowerCase());
    return idx >= 0 ? idx + 1 : 0;
  };

  // -------- PROCESS ISSUED CERTIFICATES --------
  for (const ev of issued) {
    const args = ev.args;
    const id = args.id?.toString() ?? String(args[0]);

    // fallback-safe issuer extraction
    const issuer =
      args.issuer ??
      args[4] ??
      args[3] ??
      (ev.args ? ev.args.issuer : null);

    const pIndex = findProducerIndex(issuer) || 0;

    const label = `P${pIndex}_ID${id}`;
    const leafInput = `${label}|${ev.transactionHash}`;

    leaves.push(keccak256(leafInput));
  }

  // -------- PROCESS PURCHASE EVENTS --------
  for (const ev of purchases) {
    const args = ev.args;
    const id = args.id?.toString() ?? String(args[0]);

    // FIXED: Safe fallback without mixing ?? and ||
    let to = null;
    if (args.to != null) to = args.to;
    else if (args[2] != null) to = args[2];
    else if (ev.args && ev.args.to != null) to = ev.args.to;

    const cIndex = findCompanyIndex(to) || 0;

    const label = `C${cIndex}_ID${id}`;
    const leafInput = `${label}|${ev.transactionHash}`;

    leaves.push(keccak256(leafInput));
  }

  // -------- IF NO EVENTS --------
  if (leaves.length === 0) {
    return { root: null, tree: null, leavesHex: [] };
  }

  // -------- BUILD MERKLE TREE --------
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = tree.getRoot().toString("hex");

  return {
    root: "0x" + root,
    leavesHex: leaves.map((l) => "0x" + l.toString("hex")),
    getProofForHex(leafHex) {
      return tree
        .getProof(Buffer.from(leafHex.replace(/^0x/, ""), "hex"))
        .map((p) => "0x" + p.data.toString("hex"));
    },
  };
}
