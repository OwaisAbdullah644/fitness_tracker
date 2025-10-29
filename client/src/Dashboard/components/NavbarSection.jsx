import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';

const NavbarSection = ({ user }) => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-[#111] to-[#1a1a1a] border-b border-[#333] px-6 py-4 flex items-center justify-between"
  >
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search workouts, meals..."
          className="bg-[#222] text-white pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-[#FDC700]/50 transition"
        />
      </div>
    </div>

    <div className="flex items-center space-x-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-full bg-[#222] hover:bg-[#333]"
      >
        <Bell className="w-5 h-5 text-[#FDC700]" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </motion.button>

      <div className="flex items-center space-x-2">
        <img
          src={user?.profilePic || 'https://via.placeholder.com/40'}
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FDC700]/20"
        />
        <div className="hidden md:block">
          <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
          <p className="text-xs text-gray-400">Fitness Enthusiast</p>
        </div>
      </div>
    </div>
  </motion.header>
);

export default NavbarSection;