// src/Dashboard/pages/SettingsPage.jsx (Updated to include SettingSection)
import React from 'react';
import { motion } from 'framer-motion';
import SettingSection from '../components/SettingSection';

const SettingsPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8"
  >
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Settings</h2>
    <p style={{ color: 'var(--text-muted)' }}>Customize your experience.</p>
    <SettingSection />
  </motion.div>
);

export default SettingsPage;