// frontend-vite/src/api/explorer.js
import axios from "./axiosClient";

export const getLatestBlockNumber = async () => {
  const response = await axios.get("/explorer/latest-block");
  return response.data;
};

export const getBlockDetails = async (blockNumber) => {
  const response = await axios.get(`/explorer/block/${blockNumber}`);
  return response.data;
};

export const getBlockRange = async (from, to) => {
  const response = await axios.get(`/explorer/blocks?from=${from}&to=${to}`);
  return response.data;
};

export const getTransactionDetails = async (txHash) => {
  const response = await axios.get(`/explorer/transaction/${txHash}`);
  return response.data;
};
