// src/Dashboard/pages/NutritionPage.jsx
import React from 'react';
import { motion } from 'framer-motion';

const NutritionPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8"
  >
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Nutrition</h2>
    <p style={{ color: 'var(--text-muted)' }}>Track meals and macros.</p>
  </motion.div>
);

export default NutritionPage;