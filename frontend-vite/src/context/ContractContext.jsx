import { createContext, useContext } from "react";

export const ContractContext = createContext(null);

export function useContractContext() {
  return useContext(ContractContext);
}
