'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

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
        router.push('/auth/signin'); // Redirect to sign-in page on error
        return;
      }

      console.log(session);
      if (session) {
        router.push('/dashboard'); // Redirect to dashboard if authenticated
      } else {
        router.push('/auth/signin'); // Redirect to sign-in page if not authenticated
      }
    };

    checkSession();
  }, [router]);

  return <div className="p-4">Redirecting...</div>;
}
