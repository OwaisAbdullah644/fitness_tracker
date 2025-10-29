// src/Dashboard/pages/WorkoutsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';

const WorkoutsPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8"
  >
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Workouts</h2>
    <p style={{ color: 'var(--text-muted)' }}>Log and track your workouts here.</p>
  </motion.div>
);

export default WorkoutsPage;