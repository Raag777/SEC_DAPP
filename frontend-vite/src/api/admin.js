// src/api/admin.js
import api from "./axiosClient";

export const registerProducer = (address) =>
  api.post("/admin/registerProducer", { address });

export const removeProducer = (address) =>
  api.post("/admin/removeProducer", { address });

export const registerCompany = (address) =>
  api.post("/admin/registerCompany", { address });

export const removeCompany = (address) =>
  api.post("/admin/removeCompany", { address });

export const setDefaultPrice = (priceWei) =>
  api.post("/admin/setDefaultPrice", { priceWei });
