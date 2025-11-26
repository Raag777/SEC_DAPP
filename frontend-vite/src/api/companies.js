// src/api/companies.js
import api from "./axiosClient";

export const buyCertificate = (id, priceWei) =>
  api.post("/companies/buy", { id, priceWei });

export const retireCertificate = (id) =>
  api.post("/companies/retire", { id });

export const getCompanies = () =>
  api.get("/companies/list");
