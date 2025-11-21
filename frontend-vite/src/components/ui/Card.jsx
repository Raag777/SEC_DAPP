import { motion } from "framer-motion";
export default function Card({ children, className = "" }){
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-2xl p-4 shadow ${className}`}>
      {children}
    </motion.div>
  );
}
