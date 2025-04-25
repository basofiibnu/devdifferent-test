'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase-client';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session, 'session in home page');
      window.location.replace(
        session ? '/dashboard' : '/auth/signin'
      );
    });
  }, [router]);

  return <p className="text-center mt-8">Redirecting...</p>;
}
