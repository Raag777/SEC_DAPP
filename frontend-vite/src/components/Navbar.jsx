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
    <nav className="fixed top-0 left-0 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-neutral-700 z-50">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl neon-text neon-pulse float-neon"
        >
          <span>🔆</span> <span>SEC DAPP</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-8 items-center">

          {/* HOME */}
          <Link
            to="/"
            className={`font-medium glow-underline ${
              location.pathname === "/"
                ? "text-neonBlue drop-shadow-neon"
                : "text-gray-400"
            }`}
          >
            Home
          </Link>

          {/* PRODUCERS */}
          <Link
            to="/producers"
            className={`font-medium glow-underline ${
              location.pathname === "/producers"
                ? "text-neonBlue drop-shadow-neon"
                : "text-gray-400"
            }`}
          >
            Producers
          </Link>

          {/* COMPANIES */}
          <Link
            to="/companies"
            className={`font-medium glow-underline ${
              location.pathname === "/companies"
                ? "text-neonBlue drop-shadow-neon"
                : "text-gray-400"
            }`}
          >
            Companies
          </Link>

          {/* ADMIN */}
          <Link
            to="/admin"
            className={`font-medium glow-underline ${
              location.pathname === "/admin"
                ? "text-neonBlue drop-shadow-neon"
                : "text-gray-400"
            }`}
          >
            Admin Panel
          </Link>
        </div>

        {/* Right side: Theme + Wallet */}
        <div className="flex items-center gap-4">

          {/* 🌈 NEON GLOW TOGGLE (STEP 4) */}
          <button
            onClick={() => setDark((d) => !d)}
            className={`
              relative w-16 h-8 rounded-full p-[3px]
              flex items-center transition-all duration-300
              neon-border animate-glowPulse
              ${dark ? "bg-[#0a0a14]" : "bg-[#101020]"}
            `}
          >
            <span
              className={`
                w-7 h-7 rounded-full
                ${dark ? "bg-neonPurple" : "bg-neonBlue"}
                neon-glow transform transition-all duration-300
                ${dark ? "translate-x-8" : "translate-x-0"}
              `}
            />
          </button>

          {/* Wallet connect */}
          <button
            onClick={connect}
            className="px-4 py-2 rounded-lg bg-neonBlue text-black font-semibold shadow-neon hover:shadow-neonPink transition"
          >
            {account
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : "Connect Wallet"}
          </button>
        </div>

      </div>
    </nav>
  );
}
