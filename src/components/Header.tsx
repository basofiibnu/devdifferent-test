'use client';

import { supabase } from '@/lib/supabase-browser';
import React from 'react';

const Header = () => {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          location.href = '/login';
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
