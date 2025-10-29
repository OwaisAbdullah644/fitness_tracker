// src/Dashboard/pages/ProgressPage.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ProgressPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8"
  >
    <h2 className="text-2xl font-bold text-[#FDC700] mb-4">Progress</h2>
    <p className="text-gray-300">See your weight and body changes.</p>
  </motion.div>
);

export default ProgressPage;