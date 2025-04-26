'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase-client';
import Input from '@/components/global/Input';
import Button from '@/components/global/Button';

const signupSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const handleSignup = async (data: SignupFormValues) => {
    const { name, email, password } = data;

    const { data: signupData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return alert(error.message);

    const userId = signupData.user?.id;
    if (userId) {
      await supabase
        .from('users')
        .insert([{ id: userId, email, full_name: name }]);
    }

    alert('Check your email for confirmation!');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Create an Account
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Sign up to get started
        </p>
        <form
          onSubmit={handleSubmit(handleSignup)}
          className="space-y-4"
        >
          <div>
            <Input
              type="text"
              {...register('name')}
              placeholder="Full Name"
              className={`w-full px-4 py-2 border ${
                errors.name
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'focus:ring-red-500'
                  : 'focus:ring-blue-500 dark:focus:ring-blue-400'
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="email"
              {...register('email')}
              placeholder="Email"
              className={`w-full px-4 py-2 border ${
                errors.email
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'focus:ring-red-500'
                  : 'focus:ring-blue-500 dark:focus:ring-blue-400'
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              {...register('password')}
              placeholder="Password"
              className={`w-full px-4 py-2 border ${
                errors.password
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'focus:ring-red-500'
                  : 'focus:ring-blue-500 dark:focus:ring-blue-400'
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition"
          >
            Create Account
          </Button>
        </form>

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
