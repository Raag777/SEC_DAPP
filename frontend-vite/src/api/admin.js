import axiosClient from "./axiosClient";
export const registerProducer = (address) => axiosClient.post("/admin/registerProducer", { address });
export const removeProducer = (address) => axiosClient.post("/admin/removeProducer", { address });
export const listProducers = () => axiosClient.get("/producers");
