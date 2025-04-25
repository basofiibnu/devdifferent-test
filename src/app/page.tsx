'use client';

import { useEffect } from 'react';
import { supabase } from '../lib/supabase-client';

export default function HomePage() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session, 'session in home page');
      window.location.href = session ? '/dashboard' : '/auth/signin';
    });
  }, []);

  return <p className="text-center mt-8">Redirecting...</p>;
}
