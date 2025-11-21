// frontend-vite/src/components/Card.jsx
import { motion } from "framer-motion";

export default function Card({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`p-6 rounded-2xl bg-white shadow-sm border border-gray-200 ${className}`}
    >
      {children}
    </motion.div>
  );
}
