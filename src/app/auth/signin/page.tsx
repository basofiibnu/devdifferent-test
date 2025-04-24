'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-browser';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleMagicLinkLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    setMsg(
      error ? error.message : 'Check your email for the login link!'
    );
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-bold">Sign in</h1>
      <input
        className="border p-2 w-full"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleMagicLinkLogin}
        className="bg-black text-white px-4 py-2 w-full rounded"
      >
        Send Magic Link
      </button>
      {msg && <p className="text-sm text-gray-500">{msg}</p>}
    </div>
  );
}
