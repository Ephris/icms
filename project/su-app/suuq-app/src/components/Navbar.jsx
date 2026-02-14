'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Star, LogOut } from 'lucide-react';
import { supabase, getUser, signOut } from '@/lib/supabase';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    getUser().then(setUser);
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: 'Marketplace' },
    { href: '/post', label: '+ Sell Product', highlight: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-100'
          : 'bg-white/95 backdrop-blur-xl border-b border-gray-100/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-[68px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 bg-somali-400 rounded-lg flex items-center justify-center shadow-md shadow-somali-400/30">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg text-somali-400 leading-none">
              Suuq
            </span>
            <span className="text-[9px] text-gray-400 font-semibold tracking-[1.5px] uppercase">
              Soomaaliyeed
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                link.highlight
                  ? 'bg-somali-400 text-white shadow-md shadow-somali-400/30 hover:bg-somali-500'
                  : pathname === link.href
                  ? 'bg-somali-50 text-somali-500 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 rounded-full bg-somali-400 text-white flex items-center justify-center text-sm font-bold">
                {user.user_metadata?.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-red-500 text-sm font-medium px-3 py-1.5 border border-gray-200 rounded-full hover:border-red-300 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 ml-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold bg-somali-50 text-somali-500 rounded-full hover:bg-somali-100 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                link.highlight
                  ? 'bg-somali-400 text-white'
                  : pathname === link.href
                  ? 'bg-somali-50 text-somali-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 text-left"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                Login
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold bg-somali-50 text-somali-500">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
