// src/Dashboard/pages/NutritionPage.jsx
import React from 'react';
import { motion } from 'framer-motion';

const NutritionPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8"
  >
    <h2 className="text-2xl font-bold text-[#FDC700] mb-4">Nutrition</h2>
    <p className="text-gray-300">Track meals and macros.</p>
  </motion.div>
);

export default NutritionPage;