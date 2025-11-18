// src/layouts/DashboardLayout.jsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, User, Factory, Shield, Satellite, Search } from "lucide-react";
import useContract from "../hooks/useContract";

// 🔥 NEW — import role switcher
import RoleManager from "../components/RoleManager";

function getInitialTheme() {
  return localStorage.getItem("sec-dapp-theme") === "dark";
}

export default function DashboardLayout({ title, children }) {
  const { role, walletAddress, connected, connectWallet, disconnect } = useContract();
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("sec-dapp-theme", dark ? "dark" : "light");
  }, [dark]);

  const baseMenu = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    { to: "/producer", label: "Producer", icon: <User size={18} /> },
    { to: "/company", label: "Company", icon: <Factory size={18} /> },
    { to: "/explorer", label: "Explorer", icon: <Search size={18} /> },
    { to: "/simulate-iot", label: "IoT Simulator", icon: <Satellite size={18} /> },
  ];

  const menu =
    role === "admin"
      ? [...baseMenu, { to: "/admin", label: "Admin", icon: <Shield size={18} /> }]
      : baseMenu;

  return (
    <div className={`flex min-h-screen ${dark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      
      {/* Sidebar */}
      <aside
        className={`${open ? "w-64" : "w-20"} h-screen bg-blue-800 dark:bg-gray-800 p-4 text-white 
        flex flex-col justify-between transition-all duration-300`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-md flex items-center justify-center">
                ☀️
              </div>
              {open && <h2 className="text-lg font-semibold">{title}</h2>}
            </div>

            <button onClick={() => setOpen((o) => !o)}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Menu List */}
          <nav className="flex flex-col gap-2">
            {menu.map((m) => {
              const active = location.pathname === m.to;
              return (
                <Link
                  key={m.to}
                  to={m.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                    active ? "bg-blue-600 shadow-md" : "hover:bg-blue-700"
                  }`}
                >
                  {m.icon}
                  {open && <span>{m.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div>
          <div className="border-t border-white/20 pt-4">
            {connected ? (
              <div className="mb-2 text-sm">
                {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                <div className="text-xs text-gray-300">{role}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-300 mb-2">Wallet Not Connected</div>
            )}

            {connected ? (
              <button
                onClick={disconnect}
                className="bg-red-500 w-full py-1 rounded-md hover:bg-red-600"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-green-500 w-full py-1 rounded-md hover:bg-green-600"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Theme toggle */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <span>🌙 Dark Mode</span>
            <input type="checkbox" checked={dark} onChange={() => setDark(!dark)} />
          </div>
        </div>
      </aside>

      {/* Page Content + Role Manager */}
      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {children}

            {/* 🔥 Added here — Role override UI */}
            <RoleManager />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
