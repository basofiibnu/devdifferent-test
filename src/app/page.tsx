'use client';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  useEffect(() => {
    const check = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      console.log(data, error);
    };
    check();
  }, []);

  return <div className="p-4">Check the console 🚀</div>;
}
