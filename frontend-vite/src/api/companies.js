import axiosClient from "./axiosClient";

export const registerCompany = (address, name) =>
  axiosClient.post("/companies/register", { address, name });

export const removeCompany = (address) =>
  axiosClient.post("/companies/remove", { address });

export const listCompanies = () =>
  axiosClient.get("/companies");
