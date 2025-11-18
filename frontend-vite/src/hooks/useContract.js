// src/hooks/useContract.js
import { useContext } from "react";
import { ContractContext } from "../context/ContractContext";

export default function useContract() {
  const ctx = useContext(ContractContext);

  if (!ctx) {
    throw new Error("useContract must be used inside <ContractProvider>");
  }

  return ctx;
}
