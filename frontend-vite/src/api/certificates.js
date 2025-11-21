import axiosClient from "./axiosClient";

export const listCertificates = () => axiosClient.get("/certificates");

export const getCertificate = (id) => axiosClient.get(`/getSEC/${id}`);

export const downloadCertificate = (id) => `${import.meta.env.VITE_API_URL}/download_certificate/${id}`;

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


