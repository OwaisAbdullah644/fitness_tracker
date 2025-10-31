// src/Dashboard/pages/NutritionPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import NutritionLogsSection from '../components/NutritionLogsSection';

const NutritionPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8"
  >
    <NutritionLogsSection/>
  </motion.div>
);

export default NutritionPage;