// src/Dashboard/pages/Sidebar.jsx
import React from 'react';
import SidebarSection from '../components/SidebarSection';

const Sidebar = ({ user, logout }) => <SidebarSection user={user} logout={logout} />;

export default Sidebar;