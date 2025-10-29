// src/Dashboard/pages/GoalsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';

const GoalsPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8"
  >
    <h2 className="text-2xl font-bold text-[#FDC700] mb-4">Goals</h2>
    <p className="text-gray-300">Set and track fitness goals.</p>
  </motion.div>
);

export default GoalsPage;