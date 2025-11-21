// src/api/producers.js
import api from "./axiosClient";

export const issueCertificate = (owner, energyWh) =>
  api.post("/producers/issue", { owner, energyWh });

export const setProducerPrice = (priceWei) =>
  api.post("/producers/setPrice", { priceWei });

export const getProducerList = () =>
  api.get("/producers/list");
