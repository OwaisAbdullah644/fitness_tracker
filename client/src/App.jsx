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
import ProfilePage from './Dashboard/pages/ProfilePage';
import toast from 'react-hot-toast';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const SESSION_TIMEOUT = 30 * 60 * 1000; 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedLoginTime = localStorage.getItem('loginTime');

    if (storedUser && storedLoginTime) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const timeElapsed = Date.now() - parseInt(storedLoginTime);
        
        if (timeElapsed < SESSION_TIMEOUT) {
          setUser(parsedUser);
          const remainingTime = SESSION_TIMEOUT - timeElapsed;
          startSessionTimeout(remainingTime);
        } else {
          handleLogout();
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (data) => {
    const loginTimestamp = Date.now().toString();
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('loginTime', loginTimestamp);
    setUser(data);
    startSessionTimeout(SESSION_TIMEOUT);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const startSessionTimeout = (timeoutDuration) => {
    if (window.sessionTimeout) {
      clearTimeout(window.sessionTimeout);
    }
    window.sessionTimeout = setTimeout(() => {
      handleLogout();
      // toast.error('Session expired. You have been logged out for security.');
    }, timeoutDuration);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const ProtectedDashboard = ({ children }) => {
    return user ? <DashboardLayout user={user} logout={handleLogout}>{children}</DashboardLayout> : <Navigate to="/login" replace />;
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
          <Route path="/dashboard/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;