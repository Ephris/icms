'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isSupabaseConfigured()) {
      // Demo mode
      const user = localStorage.getItem('suuq_user');
      if (user) {
        router.push('/');
      } else {
        setError('No account found. Please register first.');
      }
      setLoading(false);
      return;
    }

    const { error: authError } = await signIn({ email, password });
    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      router.push('/');
    }
  }

  return (
    <>
      <header className="relative pt-32 pb-20 bg-gradient-to-br from-somali-800 via-somali-400 to-somali-300 text-center">
        <h1 className="font-display font-black text-4xl text-white mb-2">Sign In</h1>
        <p className="text-white/70 text-base">Welcome back to Suuq Soomaaliyeed</p>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 block">
            <path d="M0,50 C480,0 960,80 1440,30 L1440,80 L0,80 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </header>

      <section className="py-14 bg-gray-50">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-1">Login</h2>
            <p className="text-sm text-gray-500 mb-7">Sign in to manage your listings and post products.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-somali-400 text-white font-bold rounded-lg hover:bg-somali-500 disabled:opacity-50 transition-all"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account? <Link href="/register" className="text-somali-400 font-semibold hover:underline">Register for Free</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
