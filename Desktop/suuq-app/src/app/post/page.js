'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, CheckCircle, Lock } from 'lucide-react';
import { getUser, createProduct, uploadImage, isSupabaseConfigured } from '@/lib/supabase';
import { CITIES, CATEGORIES } from '@/lib/constants';

export default function PostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);

  const [form, setForm] = useState({
    title: '', category: '', city: '', price: '', phone: '', description: '', contactName: '',
  });

  useEffect(() => {
    async function check() {
      if (isSupabaseConfigured()) {
        const u = await getUser();
        setUser(u);
      } else {
        // Demo mode
        const stored = localStorage.getItem('suuq_user');
        if (stored) {
          const u = JSON.parse(stored);
          setUser(u);
          setForm((f) => ({ ...f, contactName: u.name || '', phone: u.phone || '', city: u.city || '' }));
        }
      }
      setAuthChecked(true);
    }
    check();
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  function handleFiles(e) {
    const selected = Array.from(e.target.files).slice(0, 5);
    setFiles(selected);
    const urls = selected.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isSupabaseConfigured()) {
      // Demo mode
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 800);
      return;
    }

    try {
      // Upload images
      const imageUrls = [];
      for (const file of files) {
        const { url, error: uploadErr } = await uploadImage(file, user.id);
        if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`);
        imageUrls.push(url);
      }

      const { error: createErr } = await createProduct({
        seller_id: user.id,
        title: form.title,
        category: form.category,
        city: form.city,
        price: parseFloat(form.price),
        currency: 'USD',
        phone: form.phone,
        seller_name: form.contactName,
        description: form.description,
        images: imageUrls,
      });

      if (createErr) throw new Error(createErr.message);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Auth check
  if (authChecked && !user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl p-10 shadow-lg text-center">
            <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-500 text-sm mb-6">You need an account to post products. It&apos;s free!</p>
            <div className="flex gap-3 justify-center">
              <Link href="/register" className="px-6 py-2.5 bg-somali-400 text-white font-semibold rounded-full hover:bg-somali-500 transition-colors">
                Create Account
              </Link>
              <Link href="/login" className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl p-10 shadow-lg text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Product Listed!</h2>
            <p className="text-gray-500 mb-6">Your product is now live. Buyers will contact you by phone.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/" className="px-6 py-2.5 bg-somali-400 text-white font-semibold rounded-full hover:bg-somali-500 transition-colors">
                View Marketplace
              </Link>
              <button
                onClick={() => { setSuccess(false); setForm({ title: '', category: '', city: form.city, price: '', phone: form.phone, description: '', contactName: form.contactName }); setFiles([]); setPreviews([]); }}
                className="px-6 py-2.5 bg-somali-50 text-somali-500 font-semibold rounded-full hover:bg-somali-100 transition-colors"
              >
                Post Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="relative pt-32 pb-20 bg-gradient-to-br from-somali-800 via-somali-400 to-somali-300 text-center">
        <h1 className="font-display font-black text-4xl text-white mb-2">Sell Your Product</h1>
        <p className="text-white/70 text-base">List for free and reach buyers across the Somali world</p>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 block">
            <path d="M0,50 C480,0 960,80 1440,30 L1440,80 L0,80 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </header>

      <section className="py-14 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-1">Product Details</h2>
            <p className="text-sm text-gray-500 mb-7">Buyers will contact you directly by phone.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Title *</label>
                <input type="text" required value={form.title} onChange={update('title')}
                  placeholder="e.g. Samsung Galaxy S24, Toyota Land Cruiser, 50 Goats..."
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
                <p className="text-[11px] text-gray-400 mt-1">Be specific — include brand, model, quantity</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
                  <select required value={form.category} onChange={update('category')}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all">
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
                  <select required value={form.city} onChange={update('city')}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all">
                    <option value="">Select city</option>
                    {CITIES.map((c) => (
                      <option key={c.name} value={c.name}>{c.name} ({c.country})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Price (USD) *</label>
                  <input type="number" required min="0" value={form.price} onChange={update('price')}
                    placeholder="e.g. 500"
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                  <input type="tel" required value={form.phone} onChange={update('phone')}
                    placeholder="+252 61 234 5678"
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
                <textarea required rows={4} value={form.description} onChange={update('description')}
                  placeholder="Describe your product: condition, features, pickup location..."
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all resize-y" />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Photos</label>
                <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-somali-400 hover:bg-somali-50/30 transition-all">
                  <Camera className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500"><span className="text-somali-400 font-semibold">Click to upload</span> — up to 5 photos</p>
                  <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
                </label>
                {previews.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {previews.map((src, i) => (
                      <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
                <input type="text" required value={form.contactName} onChange={update('contactName')}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                By posting, you confirm this is a legitimate listing. Your phone number will be visible to buyers.
                Suuq Soomaaliyeed is not responsible for transactions between buyers and sellers.
              </p>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-somali-400 text-white font-bold rounded-lg hover:bg-somali-500 disabled:opacity-50 transition-all text-base"
              >
                {loading ? 'Posting...' : 'Post Product — It\'s Free'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
