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
        console.error(
          'Session fetch error or user canceled login:',
          error
        );
        alert('Login canceled or failed. Please try again.');
        router.push('/auth/signin');
        return;
      }

      console.log(sessionData, 'session in auth callback page');
      const user = sessionData.session.user;

      const { data: existing, error: existingError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingError) {
        console.error(
          'Error checking existing user:',
          existingError.message
        );
      }

      if (!existing) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email,
            },
          ]);

        if (insertError) {
          console.error('Error inserting user:', insertError.message);
          alert(
            'An error occurred while saving your account. Please try again.'
          );
          router.push('/auth/signin');
          return;
        }
      }

      router.push('/dashboard');
    };

    handleOAuth();
  }, [router]);

  return (
    <p className="text-center mt-8">Signing in with Google...</p>
  );
}
