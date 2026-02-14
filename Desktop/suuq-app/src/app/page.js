'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, Star, Phone, MapPin, ArrowRight, ClipboardList,
  Handshake, X,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, isSupabaseConfigured } from '@/lib/supabase';
import { CITIES, CATEGORIES, SAMPLE_PRODUCTS, SITE_TAGLINE } from '@/lib/constants';

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState(searchParams.get('city') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Load products
  useEffect(() => {
    async function load() {
      setLoading(true);
      if (isSupabaseConfigured()) {
        const data = await fetchProducts({ city, category, search, sort });
        setProducts(data);
      } else {
        // Demo mode — filter sample data client-side
        setProducts(SAMPLE_PRODUCTS);
      }
      setLoading(false);
    }
    load();
  }, [city, category, sort]);

  // Client-side filtering for demo mode
  const filtered = useMemo(() => {
    let result = [...products];
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }
    if (city !== 'all') result = result.filter((p) => p.city === city);
    if (category !== 'all') result = result.filter((p) => p.category === category);

    switch (sort) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'name-asc': result.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return result;
  }, [products, search, city, category, sort]);

  // Category counts
  const catCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const hasFilters = city !== 'all' || category !== 'all' || search;

  function clearFilters() {
    setCity('all');
    setCategory('all');
    setSearch('');
  }

  const uniqueCities = [...new Set(products.map((p) => p.city))].sort();
  const uniqueCategories = [...new Set(products.map((p) => p.category))].sort();

  return (
    <>
      {/* ========== HERO ========== */}
      <header className="relative min-h-[560px] flex items-center overflow-hidden bg-gradient-to-br from-somali-800 via-somali-400 to-somali-300">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M40 0l5.878 17.09H64.72L49.42 27.64l5.878 17.09L40 34.18l-15.298 10.55 5.878-17.09L15.28 17.09h18.844z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 border border-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs font-semibold tracking-wider uppercase mb-6">
            <Star className="w-3.5 h-3.5 fill-white" />
            {SITE_TAGLINE}
          </div>

          <h1 className="font-display font-black text-white text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-4">
            Iibso & Iibi
          </h1>
          <p className="text-white/70 text-lg sm:text-xl font-light mb-2">
            Buy & Sell Across the Somali World
          </p>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            List your products for free. Customers call you directly and arrange pickup.
            No middleman, no fees — just community commerce.
          </p>

          {/* Hero search */}
          <div className="max-w-lg mx-auto relative mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, categories, cities..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-800 font-medium text-sm shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
            />
          </div>

          {/* City pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {['Mogadishu', 'Hargaysa', 'Jijiga', 'Dubai', 'Guangzhou', 'Garissa'].map((c) => (
              <button
                key={c}
                onClick={() => { setCity(c); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-3.5 py-1.5 bg-white/12 border border-white/15 rounded-full text-white/85 text-xs font-medium hover:bg-white/25 transition-all"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-16 block">
            <path d="M0,70 C480,0 960,100 1440,30 L1440,100 L0,100 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </header>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            {[
              { icon: <ClipboardList className="w-6 h-6" />, title: 'List for Free', desc: 'Post product with photos, price & phone' },
              { icon: <Phone className="w-6 h-6" />, title: 'Buyer Calls You', desc: 'Interested buyers contact you directly' },
              { icon: <Handshake className="w-6 h-6" />, title: 'Arrange Pickup', desc: 'Meet up and complete the deal' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                {i > 0 && <ArrowRight className="hidden sm:block w-5 h-5 text-somali-300 flex-shrink-0 -ml-4 mr-2" />}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-somali-50 text-somali-400 flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
                    <p className="text-xs text-gray-500">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section className="py-14 bg-gray-50" id="categories">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(category === cat.name ? 'all' : cat.name);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all text-center ${
                  category === cat.name
                    ? 'border-somali-400 bg-somali-50 shadow-md'
                    : 'border-transparent bg-white shadow-sm hover:border-somali-200 hover:-translate-y-0.5'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[11px] font-semibold text-gray-700 leading-tight">{cat.name}</span>
                <span className="text-[10px] text-gray-400">{catCounts[cat.name] || 0}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRODUCTS ========== */}
      <section className="py-14 bg-gray-50" id="products">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header + filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-display font-extrabold text-2xl text-gray-900">
              Latest Listings
            </h2>
            <div className="flex flex-wrap gap-2.5">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-3 py-2 text-sm border-2 border-gray-200 rounded-lg bg-white focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none"
              >
                <option value="all">All Cities</option>
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.country})
                  </option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 text-sm border-2 border-gray-200 rounded-lg bg-white focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 text-sm border-2 border-gray-200 rounded-lg bg-white focus:border-somali-400 focus:ring-2 focus:ring-somali-50 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {city !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-somali-50 text-somali-500 rounded-full text-xs font-semibold">
                  City: {city}
                  <button onClick={() => setCity('all')} className="opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
                </span>
              )}
              {category !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-somali-50 text-somali-500 rounded-full text-xs font-semibold">
                  {category}
                  <button onClick={() => setCategory('all')} className="opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-somali-50 text-somali-500 rounded-full text-xs font-semibold">
                  &quot;{search}&quot;
                  <button onClick={() => setSearch('')} className="opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-somali-400 font-medium ml-1">
                Clear all
              </button>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-5">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Search className="w-14 h-14 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">No products found</h3>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20 bg-gradient-to-br from-somali-400 to-somali-600 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
            Have something to sell?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            List your product for free and reach buyers across the Somali world.
          </p>
          <Link
            href="/post"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-somali-500 font-bold rounded-full shadow-xl hover:-translate-y-0.5 hover:shadow-2xl transition-all"
          >
            Start Selling — It&apos;s Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-somali-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
