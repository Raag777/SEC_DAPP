// src/components/Button.jsx
import { motion } from "framer-motion";

export default function Button({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`
        px-4 py-2 rounded-xl 
        text-white font-semibold 
        bg-[#0a0a12] neon-border neon-hover
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
