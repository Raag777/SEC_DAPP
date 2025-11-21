// src/api/certificates.js
import api from "./axiosClient";

export const getAllCertificates = () =>
  api.get("/certificates/all");

export const getCertificate = (id) =>
  api.get(`/certificates/${id}`);

export const getCertificatesOfOwner = (address) =>
  api.get(`/certificates/owner/${address}`);
