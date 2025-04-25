'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import Input from '@/components/global/Input';
import Button from '@/components/global/Button';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return alert(error.message);

    // Save user info into our `users` table
    const userId = data.user?.id;
    if (userId) {
      await supabase
        .from('users')
        .insert([{ id: userId, email, full_name: name }]);
    }

    alert('Check your email for confirmation!');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Create an Account
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Sign up to get started
        </p>
        <div className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Button
            onClick={handleSignup}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500"
          >
            Create Account
          </Button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <a
            href="/auth/signin"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
