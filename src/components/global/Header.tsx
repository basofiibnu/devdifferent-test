'use client';

import { supabase } from '@/lib/supabase-client';
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import PropertyForm from '../PropertyForm';
import { useProperties } from '@/context/PropertiesCtx';
import { MoonIcon, SunIcon } from '@heroicons/react/16/solid';
import Button from './Button';
import Input from './Input';
import { useDebounce } from '@/hooks/useDebounce';

const Header = () => {
  const { refreshProperties, setPriceFilter } = useProperties();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [price, setPrice] = useState<number | ''>('');

  const debouncedPrice = useDebounce(
    price === '' ? null : Number(price),
    1000
  );

  useEffect(() => {
    setPriceFilter(debouncedPrice);
  }, [debouncedPrice, setPriceFilter]);

  useEffect(() => {
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
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
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

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    setPrice(value);
    setPriceFilter(value === '' ? null : value);
  };

  return (
    <div className="flex items-center justify-between px-4 py-6 bg-gray-100 dark:bg-gray-900 shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Dashboard
      </h1>
      <div className="space-x-4 flex items-center">
        <Input
          type="number"
          value={price}
          onChange={handlePriceChange}
          placeholder="Filter by lowest price"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />

        <Button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </Button>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-500 transition"
        >
          Add Property
        </Button>

        <Button
          onClick={handleLogout}
          className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 dark:hover:bg-red-500 transition"
        >
          Logout
        </Button>
      </div>

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
