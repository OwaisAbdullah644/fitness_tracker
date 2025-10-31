// src/Dashboard/components/NavbarSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavbarSection = ({ user, toggleTheme, isDark }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-header px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search workouts, meals..."
            className="input pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 rounded-full card"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          ) : (
            <Moon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-full card"
        >
          <Bell className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={handleProfileClick}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <img
            src={user?.profilePic ? `http://localhost:3000/uploads/${user.profilePic}` : 'https://via.placeholder.com/40'}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[var(--accent)]/20"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fitness Enthusiast</p>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default NavbarSection;