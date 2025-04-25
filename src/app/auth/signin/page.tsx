'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/global/Input';
import Button from '@/components/global/Button';
import { supabase } from '@/lib/supabase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return alert('Login failed: ' + error.message);
    router.push('/');
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) return alert('Google login error: ' + error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Sign in to your account to continue
        </p>
        <div className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <Button
            onClick={handleEmailLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition"
          >
            Login with Email
          </Button>

          <div className="flex items-center justify-between">
            <hr className="w-full border-gray-300 dark:border-gray-700" />
            <span className="text-sm text-gray-500 dark:text-gray-400 px-2">
              OR
            </span>
            <hr className="w-full border-gray-300 dark:border-gray-700" />
          </div>

          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-400 flex items-center justify-center space-x-2 transition"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.5 0 6.6 1.3 9 3.4l6.7-6.7C35.6 2.5 30.1 0 24 0 14.6 0 6.6 5.8 3 14.2l7.8 6.1C12.5 13.3 17.7 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.5 24c0-1.6-.2-3.2-.5-4.7H24v9h12.7c-.5 2.7-2 5-4.2 6.5l6.7 5.2c3.9-3.6 6.3-8.9 6.3-15z"
              />
              <path
                fill="#FBBC05"
                d="M10.8 28.3c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8L3 14.2C1.1 17.7 0 21.7 0 26s1.1 8.3 3 11.8l7.8-6.1z"
              />
              <path
                fill="#4285F4"
                d="M24 48c6.5 0 12-2.1 16-5.8l-7.8-6.1c-2.2 1.5-5 2.4-8.2 2.4-6.3 0-11.5-4.3-13.4-10.1l-7.8 6.1C6.6 42.2 14.6 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            <span>Login with Google</span>
          </Button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          Dont have an account?{' '}
          <a
            href="/auth/signup"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
