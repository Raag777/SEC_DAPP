// backend-node/src/services/merkleService.js
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import solarAbi from "../abi/SolarEnergyCertificate.json";

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, solarAbi, provider);

/**
 * Build merkle tree of CertificateIssued + CertificatePurchased events for a block range.
 * Leaves format: keccak256( label + '|' + txHash )
 * label example: "P{producerIndex}_ID{certId}" - producerIndex we compute via scanning producer list.
 */
export async function buildMerkleTree(fromBlock = 0, toBlock = "latest") {
  // 1. get producer list (to create labels). producer index is 1-based in contract
  const producers = await contract.producers();
  const companies = await contract.companies();

  // 2. fetch CertificateIssued events
  const issueFilter = contract.filters.CertificateIssued();
  const purchaseFilter = contract.filters.CertificatePurchased();

  const issued = await contract.queryFilter(issueFilter, fromBlock, toBlock);
  const purchases = await contract.queryFilter(purchaseFilter, fromBlock, toBlock);

  const leaves = [];

  // helper to compute producer index from address
  const findProducerIndex = (addr) => {
    const idx = producers.findIndex((p) => p.toLowerCase() === addr.toLowerCase());
    return idx >= 0 ? idx + 1 : 0;
  };
  const findCompanyIndex = (addr) => {
    const idx = companies.findIndex((p) => p.toLowerCase() === addr.toLowerCase());
    return idx >= 0 ? idx + 1 : 0;
  };

  for (const ev of issued) {
    const a = ev.args;
    const id = a.id.toString();
    const issuer = a.issuer || a[4] || ev.args?.issuer || ev.args?.by || null;
    const pIndex = findProducerIndex(issuer) || 0;
    const label = `P${pIndex}_ID${id}`;
    const leafInput = `${label}|${ev.transactionHash}`;
    leaves.push(keccak256(leafInput));
  }

  for (const ev of purchases) {
    const a = ev.args;
    const id = a.id.toString();
    const to = a.to || a[2] || null;
    const cIndex = findCompanyIndex(to) || 0;
    const label = `C${cIndex}_ID${id}`;
    const leafInput = `${label}|${ev.transactionHash}`;
    leaves.push(keccak256(leafInput));
  }

  if (leaves.length === 0) {
    return { root: null, tree: null, leavesHex: [] };
  }

  // Build merkle tree
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = tree.getRoot().toString("hex");

  return {
    root: "0x" + root,
    leavesHex: leaves.map((l) => "0x" + l.toString("hex")),
    proofForLeaf(leafHex) { return tree.getProof(Buffer.from(leafHex.replace(/^0x/, ""), "hex")).map(p => "0x"+p.data.toString("hex")) },
  };
}
