'use client';

import { supabase } from '@/lib/supabase-client';
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import PropertyForm from '../PropertyForm';
import { useProperties } from '@/context/PropertiesCtx';

const Header = () => {
  const { refreshProperties } = useProperties();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check the initial theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (
      storedTheme === 'dark' ||
      (!storedTheme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
      console.log('Switched to light mode'); // Debugging
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
      console.log('Switched to dark mode'); // Debugging
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.href = '/';
  };

  const handleClose = () => {
    setIsModalOpen(false);
    refreshProperties();
  };

  return (
    <div className="flex items-center justify-between px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Dashboard
      </h1>
      <div className="space-x-4 flex items-center">
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
        >
          Add Property
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 dark:hover:bg-red-500"
        >
          Logout
        </button>
      </div>

      {/* Modal for PropertyForm */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Add Property
        </h2>
        <PropertyForm property={null} onClose={() => handleClose()} />
      </Modal>
    </div>
  );
};

export default Header;
