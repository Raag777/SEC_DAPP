import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accs) => {
        if (accs && accs.length) setAccount(accs[0]);
      });
      window.ethereum.on && window.ethereum.on("accountsChanged", (accs) => {
        setAccount(accs[0] || null);
      });
    }
  }, []);

  async function connect() {
    if (!window.ethereum) return alert("Install MetaMask");
    const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accs[0]);
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 header-blur shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
        <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <span>🔆</span> <span>SEC DApp</span>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link className={`font-medium ${location.pathname === '/' ? "text-blue-600" : "text-gray-700"}`} to="/">Home</Link>
          <Link className={`font-medium ${location.pathname === '/producers' ? "text-blue-600" : "text-gray-700"}`} to="/producers">Producers</Link>
          <Link className={`font-medium ${location.pathname === '/companies' ? "text-blue-600" : "text-gray-700"}`} to="/companies">Companies</Link>
          <Link className={`font-medium ${location.pathname === '/admin' ? "text-blue-600" : "text-gray-700"}`} to="/admin">Admin Panel</Link>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={connect} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">
            {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>
      </div>
    </nav>
  );
}
