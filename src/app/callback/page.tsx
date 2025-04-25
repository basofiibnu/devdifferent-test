'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const confirmLogin = async () => {
      await supabase.auth.getSession(); // ensure session is set
      router.push('/');
    };
    confirmLogin();
  }, []);

  return <p className="text-center mt-8">Signing in...</p>;
}
