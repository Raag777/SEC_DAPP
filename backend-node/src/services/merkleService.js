import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { loadCertificates } from "./certificateStore.js";

export function getMerkleTree() {
    const certs = loadCertificates();
    const leaves = certs.map(c => keccak256(c.leaf));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    return {
        tree,
        root: tree.getHexRoot(),
        leaves: certs
    };
}
