'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuth = async () => {
      const { data: sessionData, error } =
        await supabase.auth.getSession();
      if (error || !sessionData.session) {
        console.error('Session fetch error:', error);
        return;
      }

      const user = sessionData.session.user;

      // Try inserting to `users` table only if doesn't exist
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existing) {
        await supabase.from('users').insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email,
          },
        ]);
      }

      router.push('/');
    };

    handleOAuth();
  }, []);

  return (
    <p className="text-center mt-8">Signing in with Google...</p>
  );
}
