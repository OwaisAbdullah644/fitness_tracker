// src/Dashboard/components/DashboardLayout.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Navbar';      // thin wrapper
import Sidebar from '../pages/Sidebar';    // thin wrapper

const DashboardLayout = ({ user, logout }) => (
  <div className="flex min-h-screen bg-black text-white">
    <Sidebar user={user} logout={logout} />
    <div className="flex-1 flex flex-col">
      <Navbar user={user} />
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 py-4 bg-gradient-to-r from-[#111] to-[#1a1a1a] border-b border-[#333]"
      >
        <h1 className="text-2xl font-bold text-[#FDC700]">Fitness Tracker</h1>
      </motion.header>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;