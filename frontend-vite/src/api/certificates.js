import axiosClient from "./axiosClient";

export const getAllCertificates = () =>
  axiosClient.get("/certificates");

export const getByOwner = (address) =>
  axiosClient.get(`/certificates/owner/${address}`);

export const purchaseCertificate = (buyer, certID) =>
  axiosClient.post("/certificates/purchase", { buyer, certID });

export const getMerkleRoot = () =>
  axiosClient.get("/merkle/root");

export const getMerkleProof = (certID) =>
  axiosClient.get(`/merkle/proof/${certID}`);
