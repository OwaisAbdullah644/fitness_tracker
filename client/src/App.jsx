// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ComingSoon from './components/ComingSoon';
import DashboardLayout from './Dashboard/components/DashboardLayout';

import HomePage        from './Dashboard/pages/HomePage';
import WorkoutsPage    from './Dashboard/pages/WorkoutsPage';
import NutritionPage   from './Dashboard/pages/NutritionPage';
import ProgressPage    from './Dashboard/pages/ProgressPage';
import GoalsPage       from './Dashboard/pages/GoalsPage';
import SchedulePage    from './Dashboard/pages/SchedulePage';
import AnalyticsPage   from './Dashboard/pages/AnalyticsPage';
import SettingsPage    from './Dashboard/pages/SettingsPage';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    setLoading(false); 
  }, []);

  const loginUser = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logoutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId'); 
    setUser(null);
  };

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const ProtectedDashboard = ({ children }) => {
    return user ? <DashboardLayout user={user} logout={logoutUser}>{children}</DashboardLayout> : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login Loginuser={loginUser} />} />
        <Route path="/" element={<ComingSoon />} />

      
        <Route element={<ProtectedDashboard />}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/dashboard/workouts" element={<WorkoutsPage />} />
          <Route path="/dashboard/nutrition" element={<NutritionPage />} />
          <Route path="/dashboard/progress" element={<ProgressPage />} />
          <Route path="/dashboard/goals" element={<GoalsPage />} />
          <Route path="/dashboard/schedule" element={<SchedulePage />} />
          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;