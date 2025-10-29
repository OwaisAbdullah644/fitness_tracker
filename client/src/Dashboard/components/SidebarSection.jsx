// src/Dashboard/components/SidebarSection.jsx
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
      className="sidebar relative"
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <div className="p-5 flex items-center space-x-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-black"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          FT
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>Fitness Tracker</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Level 12</p>
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
                  ? 'bg-[var(--accent)]/20 border'
                  : 'hover:bg-[var(--bg-card-hover)]'
              }`}
              style={{
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                borderColor: active ? 'var(--accent)' : 'transparent',
              }}
            >
              <Icon className="w-5 h-5" style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
              {!collapsed && <span className="font-medium">{label}</span>}
              {active && !collapsed && <ChevronRight className="ml-auto w-4 h-4" style={{ color: 'var(--accent)' }} />}
            </motion.a>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: 'var(--border)' }}>
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