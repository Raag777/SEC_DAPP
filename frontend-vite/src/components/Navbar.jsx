import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [account, setAccount] = useState(null);

  // THEME STATE
  const [dark, setDark] = useState(
    localStorage.getItem("sec_theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("sec_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("sec_theme", "light");
    }
  }, [dark]);

  /* ---------------- MetaMask ---------------- */
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accs) => {
        if (accs && accs.length) setAccount(accs[0]);
      });

      window.ethereum.on("accountsChanged", (accs) => {
        setAccount(accs[0] || null);
      });
    }
  }, []);

  async function connect() {
    if (!window.ethereum) return alert("Install MetaMask");
    const accs = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accs[0]);
  }

  return (
    <nav className="fixed top-0 left-0 w-full glass-effect shadow-solar border-b border-solar-200 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-gradient-solar transition-transform hover:scale-105"
        >
          <span className="text-3xl md:text-4xl">☀️</span>
          <span>SEC DAPP</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-6 items-center">

          {/* HOME */}
          <Link
            to="/"
            className={`font-semibold transition-all duration-200 ${
              location.pathname === "/"
                ? "text-solar-600 border-b-2 border-solar-500"
                : "text-gray-600 hover:text-solar-500"
            }`}
          >
            Home
          </Link>

          {/* PRODUCERS */}
          <Link
            to="/producers"
            className={`font-semibold transition-all duration-200 ${
              location.pathname === "/producers"
                ? "text-solar-600 border-b-2 border-solar-500"
                : "text-gray-600 hover:text-solar-500"
            }`}
          >
            Producers
          </Link>

          {/* COMPANIES */}
          <Link
            to="/companies"
            className={`font-semibold transition-all duration-200 ${
              location.pathname === "/companies"
                ? "text-energy-600 border-b-2 border-energy-500"
                : "text-gray-600 hover:text-energy-500"
            }`}
          >
            Companies
          </Link>

          {/* ADMIN */}
          <Link
            to="/admin"
            className={`font-semibold transition-all duration-200 ${
              location.pathname === "/admin"
                ? "text-sky-600 border-b-2 border-sky-500"
                : "text-gray-600 hover:text-sky-500"
            }`}
          >
            Admin Panel
          </Link>

          {/* EXPLORER */}
          <Link
            to="/explorer"
            className={`font-semibold transition-all duration-200 ${
              location.pathname === "/explorer"
                ? "text-sky-600 border-b-2 border-sky-500"
                : "text-gray-600 hover:text-sky-500"
            }`}
          >
            Explorer
          </Link>

          {/* METRICS */}
          <Link
            to="/metrics"
            className={`font-semibold transition-all duration-200 ${
              location.pathname === "/metrics"
                ? "text-solar-600 border-b-2 border-solar-500"
                : "text-gray-600 hover:text-solar-500"
            }`}
          >
            Metrics
          </Link>

          {/* CERTIFICATES (Admin) */}
          <Link
            to="/certificates"
            className={`font-semibold transition-all duration-200 ${
              location.pathname === "/certificates"
                ? "text-energy-600 border-b-2 border-energy-500"
                : "text-gray-600 hover:text-energy-500"
            }`}
          >
            Certificates
          </Link>
        </div>

        {/* Right side: Wallet */}
        <div className="flex items-center gap-4">
          {/* Wallet connect */}
          <button
            onClick={connect}
            className="btn-solar flex items-center gap-2"
          >
            <span className="text-lg">👛</span>
            <span>
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : "Connect Wallet"}
            </span>
          </button>
        </div>

      </div>
    </nav>
  );
}
