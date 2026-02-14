'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { CITIES, CATEGORIES } from '@/lib/constants';

export default function Footer() {
  const regions = [...new Set(CITIES.map((c) => c.region))];

  return (
    <footer className="bg-gray-900 text-gray-400 relative">
      {/* Wave */}
      <div className="relative -top-px">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-16 block">
          <path d="M0,40 C480,100 960,0 1440,60 L1440,0 L0,0 Z" fill="#F9FAFB" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-somali-400 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <h3 className="font-display text-xl text-white">Suuq Soomaaliyeed</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              The Global Somali Business Hub. Buy and sell freely across the Somali world — no fees, no middlemen.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 bg-somali-400 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs">★</span>
              </div>
              <span className="text-xs text-gray-500">Made for Somalia, connecting the world</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Browse Products</Link></li>
              <li><Link href="/post" className="text-sm hover:text-white transition-colors">Sell a Product</Link></li>
              <li><Link href="/register" className="text-sm hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/login" className="text-sm hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Cities</h4>
            <ul className="space-y-2.5">
              {CITIES.slice(0, 8).map((city) => (
                <li key={city.name}>
                  <Link
                    href={`/?city=${city.name}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {city.name} <span className="text-gray-600 text-xs">({city.country})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/?category=${cat.name}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 text-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Suuq Soomaaliyeed — The Global Somali Business Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
