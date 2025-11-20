import { motion } from "framer-motion";
import { useState } from "react";
import { connectWallet } from "../blockchain/contract";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const navigate = useNavigate();

  const connect = async () => {
    const acc = await connectWallet();
    setWallet(acc);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-semibold mb-8"
      >
        Solar Energy Certificate DApp
      </motion.h1>

      {!wallet ? (
        <button
          onClick={connect}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="w-full max-w-xl mt-10">
          <h2 className="text-xl mb-3 font-medium">Select Your Role:</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RoleCard title="Admin" onClick={() => navigate("/admin")} />
            <RoleCard title="Producer" onClick={() => navigate("/producers")} />
            <RoleCard title="Company" onClick={() => navigate("/companies")} />
          </div>
        </div>
      )}
    </div>
  );
}

function RoleCard({ title, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="p-6 cursor-pointer border rounded-xl bg-white shadow hover:shadow-lg transition"
    >
      <h3 className="text-xl font-semibold text-center">{title}</h3>
    </motion.div>
  );
}
