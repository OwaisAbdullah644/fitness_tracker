import React from "react";
import { motion } from "framer-motion";

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold mb-4"
      >
        Coming Soon 🚀
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-lg text-gray-400"
      >
        We’re working hard to bring something amazing. Stay tuned!
      </motion.p>
    </div>
  );
};

export default ComingSoon;
