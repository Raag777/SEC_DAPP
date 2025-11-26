import { ethers } from "ethers";
import solarABI from "@/abi/SolarEnergyCertificate.json" assert { type: "json" };

export async function getProviderAndContract() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = import.meta.env.VITE_CONTRACT_ADDRESS;
  const contract = new ethers.Contract(address, solarABI.abi, signer);
  return { provider, signer, contract };
}
