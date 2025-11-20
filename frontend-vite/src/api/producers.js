import axiosClient from "./axiosClient";

export const registerProducer = (address, name) =>
  axiosClient.post("/producers/register", { address, name });

export const removeProducer = (address) =>
  axiosClient.post("/producers/remove", { address });

export const listProducers = () =>
  axiosClient.get("/producers");
