import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home, Dumbbell, Apple, TrendingUp, Target,
  Calendar, BarChart3, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const menu = [
  { Icon: Home,        label: 'Dashboard',   path: '/dashboard' },
  { Icon: Dumbbell,    label: 'Workouts',    path: '/dashboard/workouts' },
  { Icon: Apple,       label: 'Nutrition',   path: '/dashboard/nutrition' },
  { Icon: TrendingUp,  label: 'Progress',    path: '/dashboard/progress' },
  { Icon: Target,      label: 'Goals',       path: '/dashboard/goals' },
  { Icon: Calendar,    label: 'Schedule',    path: '/dashboard/schedule' },
  { Icon: BarChart3,   label: 'Analytics',   path: '/dashboard/analytics' },
  { Icon: Settings,    label: 'Settings',    path: '/dashboard/settings' },
];

const SidebarSection = ({ user, logout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      className="relative bg-gradient-to-b from-[#0a0a0a] to-[#111] border-r border-[#333]"
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <div className="p-5 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#FDC700] to-yellow-600 rounded-xl flex items-center justify-center font-bold text-black">
          FT
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold text-[#FDC700]">Fitness Tracker</h1>
            <p className="text-xs text-gray-400">Level 12</p>
          </div>
        )}
      </div>

      <nav className="px-3 space-y-1">
        {menu.map(({ Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <motion.a
              key={path}
              href={path}
              onClick={e => { e.preventDefault(); navigate(path); }}
              whileHover={{ x: 6 }}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${
                active
                  ? 'bg-[#FDC700]/20 text-[#FDC700] border border-[#FDC700]/30'
                  : 'text-gray-400 hover:bg-[#222] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span className="font-medium">{label}</span>}
              {active && !collapsed && <ChevronRight className="ml-auto w-4 h-4" />}
            </motion.a>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#333]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default SidebarSection;