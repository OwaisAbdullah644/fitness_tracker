// src/Dashboard/pages/Navbar.jsx
import React from 'react';
import NavbarSection from '../components/NavbarSection';

const Navbar = ({ user, toggleTheme, isDark }) => (
  <NavbarSection user={user} toggleTheme={toggleTheme} isDark={isDark} />
);

export default Navbar;