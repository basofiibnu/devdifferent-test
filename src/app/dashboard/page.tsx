'use client';

import Header from '@/components/global/Header';
import Map from '@/components/Map';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
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

  return (
    <div>
      <Header />
      <Map />
    </div>
  );
}
