// src/Dashboard/components/SettingSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SettingSection = () => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    units: 'metric',
    theme: 'dark',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/preferences', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPreferences(res.data);
      } catch (err) {
        toast.error('Failed to load preferences');
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/preferences', preferences, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Preferences updated!');
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', preferences.theme);
    } catch (err) {
      toast.error('Failed to update preferences');
    }
  };

  if (loading) return <p className="text-var(--text-muted)">Loading settings...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 rounded-lg shadow-md"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>User Preferences</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            checked={preferences.notifications}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="notifications" className="text-var(--text-primary)">Enable Notifications</label>
        </div>
        <div>
          <label className="block text-var(--text-secondary) mb-1">Units of Measurement</label>
          <select
            name="units"
            value={preferences.units}
            onChange={handleChange}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            <option value="metric">Metric (kg, cm)</option>
            <option value="imperial">Imperial (lbs, in)</option>
          </select>
        </div>
        <div>
          <label className="block text-var(--text-secondary) mb-1">Theme</label>
          <select
            name="theme"
            value={preferences.theme}
            onChange={handleChange}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md font-bold"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
        >
          Save Changes
        </button>
      </form>
    </motion.div>
  );
};

export default SettingSection;