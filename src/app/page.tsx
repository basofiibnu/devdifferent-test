'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase-client';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
        router.push('/auth/signin');
        return;
      }

      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/auth/signin');
      }
    };

    checkSession();
  }, [router]);

  return <div className="p-4">Redirecting...</div>;
}
