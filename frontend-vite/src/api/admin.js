import axiosClient from "./axiosClient";

export const adminMintCertificate = (producer, energy, certID) =>
  axiosClient.post("/admin/mint", { producer, energy, certID });
