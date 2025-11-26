// backend-node/src/services/blockchain-explorer.service.js
import { provider } from "./blockchain.js";

/**
 * Get detailed block information
 */
export const getBlockDetailsService = async (blockNumber) => {
  const block = await provider.getBlock(blockNumber, true); // true = include transactions

  if (!block) {
    throw new Error(`Block ${blockNumber} not found`);
  }

  return {
    number: block.number,
    hash: block.hash,
    parentHash: block.parentHash,
    nonce: block.nonce,
    timestamp: block.timestamp,
    miner: block.miner,
    difficulty: block.difficulty?.toString() || "0",
    gasLimit: block.gasLimit?.toString() || "0",
    gasUsed: block.gasUsed?.toString() || "0",
    extraData: block.extraData,
    transactions: block.transactions || [],
    transactionCount: block.transactions?.length || 0,
    baseFeePerGas: block.baseFeePerGas?.toString() || null,
  };
};

/**
 * Get latest block number
 */
export const getLatestBlockNumberService = async () => {
  const blockNumber = await provider.getBlockNumber();
  return { blockNumber };
};

/**
 * Get multiple blocks (for visualization)
 */
export const getBlockRangeService = async (fromBlock, toBlock) => {
  const blocks = [];

  for (let i = fromBlock; i <= toBlock; i++) {
    try {
      const block = await provider.getBlock(i, false); // false = don't include full tx objects
      if (block) {
        blocks.push({
          number: block.number,
          hash: block.hash,
          parentHash: block.parentHash,
          timestamp: block.timestamp,
          transactionCount: block.transactions?.length || 0,
          miner: block.miner,
        });
      }
    } catch (err) {
      console.error(`Error fetching block ${i}:`, err.message);
    }
  }

  return { blocks };
};

/**
 * Get transaction details with receipt
 */
export const getTransactionDetailsService = async (txHash) => {
  const tx = await provider.getTransaction(txHash);
  if (!tx) {
    throw new Error(`Transaction ${txHash} not found`);
  }

  const receipt = await provider.getTransactionReceipt(txHash);

  return {
    transaction: {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value?.toString() || "0",
      gasLimit: tx.gasLimit?.toString() || "0",
      gasPrice: tx.gasPrice?.toString() || "0",
      nonce: tx.nonce,
      data: tx.data,
      blockNumber: tx.blockNumber,
      blockHash: tx.blockHash,
    },
    receipt: receipt ? {
      status: receipt.status,
      gasUsed: receipt.gasUsed?.toString() || "0",
      cumulativeGasUsed: receipt.cumulativeGasUsed?.toString() || "0",
      contractAddress: receipt.contractAddress,
      logs: receipt.logs?.length || 0,
    } : null,
  };
};
