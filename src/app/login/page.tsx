'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/session-provider';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      if (result.user) {
        setUser(result.user);
      }
      
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="fullName" className="block text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required={!isLogin}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-blue-400 hover:text-blue-300"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}