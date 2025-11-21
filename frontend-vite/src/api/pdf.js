// src/api/pdf.js
import api from "./axiosClient";

export const downloadCertificatePDF = (id) =>
  api.get(`/api/pdf/${id}`, { responseType: "blob" });

export const downloadPurchaseReceipt = (id) =>
  api.get(`/api/receipt/${id}`, { responseType: "blob" });
