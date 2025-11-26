import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";

export default function useWallet() {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    try {
      const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accs[0].toLowerCase());
      const prov = new ethers.BrowserProvider(window.ethereum);
      setProvider(prov);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setProvider(null);
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", (accs) => {
      if (!accs || accs.length === 0) return disconnect();
      setAddress(accs[0].toLowerCase());
    });
    window.ethereum.on("chainChanged", () => window.location.reload());
    return () => {
      try {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      } catch {}
    };
  }, [disconnect]);

  return { address, provider, connect, disconnect };
}
