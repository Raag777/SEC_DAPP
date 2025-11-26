// src/api/merkle.js
import api from "./axiosClient";

export const getMerkleTree = (id) =>
  api.get(`/merkle/tree/${id}`);

export const getMerkleTxData = (id) =>
  api.get(`/merkle/tx/${id}`);
