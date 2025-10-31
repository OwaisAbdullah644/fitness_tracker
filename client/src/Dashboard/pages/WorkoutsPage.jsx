// src/Dashboard/pages/WorkoutsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import RecentWorkoutsSection from '../components/RecentWorkoutsSection';

const WorkoutsPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8"
  >
    <RecentWorkoutsSection/>
  </motion.div>
);

export default WorkoutsPage;