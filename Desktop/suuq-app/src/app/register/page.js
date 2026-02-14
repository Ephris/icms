'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, CheckCircle } from 'lucide-react';
import { signUp, isSupabaseConfigured } from '@/lib/supabase';
import { CITIES } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', city: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    if (!isSupabaseConfigured()) {
      // Demo mode
      localStorage.setItem('suuq_user', JSON.stringify({
        name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        email: form.email,
        city: form.city,
      }));
      setSuccess(true);
      setLoading(false);
      return;
    }

    const { error: authError } = await signUp({
      email: form.email,
      password: form.password,
      fullName: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      city: form.city,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl p-10 shadow-lg text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Welcome to Suuq!</h2>
            <p className="text-gray-500 mb-6">Your account has been created. You can now start listing products.</p>
            <Link
              href="/post"
              className="inline-block px-6 py-3 bg-somali-400 text-white font-semibold rounded-full hover:bg-somali-500 transition-colors"
            >
              Post Your First Product
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="relative pt-32 pb-20 bg-gradient-to-br from-somali-800 via-somali-400 to-somali-300 text-center">
        <h1 className="font-display font-black text-4xl text-white mb-2">Create Account</h1>
        <p className="text-white/70 text-base">Join the Global Somali Business Hub</p>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 block">
            <path d="M0,50 C480,0 960,80 1440,30 L1440,80 L0,80 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </header>

      {/* Form */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-1">Register</h2>
            <p className="text-sm text-gray-500 mb-7">Create your free account to start buying and selling.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">First Name *</label>
                  <input type="text" required value={form.firstName} onChange={update('firstName')}
                    placeholder="Abdi" className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name *</label>
                  <input type="text" required value={form.lastName} onChange={update('lastName')}
                    placeholder="Mohamed" className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                <input type="tel" required value={form.phone} onChange={update('phone')}
                  placeholder="+252 61 234 5678" className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
                <p className="text-[11px] text-gray-400 mt-1">Shown to buyers on your listings</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                <input type="email" required value={form.email} onChange={update('email')}
                  placeholder="you@email.com" className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
                <select required value={form.city} onChange={update('city')}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all">
                  <option value="">Select your city</option>
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name} ({c.country})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password *</label>
                <input type="password" required minLength={6} value={form.password} onChange={update('password')}
                  placeholder="At least 6 characters" className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Password *</label>
                <input type="password" required value={form.confirmPassword} onChange={update('confirmPassword')}
                  placeholder="Repeat your password" className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-somali-400 text-white font-bold rounded-lg hover:bg-somali-500 disabled:opacity-50 transition-all"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account? <Link href="/login" className="text-somali-400 font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
