'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Phone, Eye, Calendar, ArrowLeft, Tag, User, ChevronLeft, ChevronRight, Share2,
} from 'lucide-react';
import { fetchProduct, isSupabaseConfigured } from '@/lib/supabase';
import { SAMPLE_PRODUCTS } from '@/lib/constants';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(dateStr).toLocaleDateString();
}

function formatPrice(price) {
  return price >= 1000 ? `$${price.toLocaleString()}` : `$${price}`;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured()) {
        const data = await fetchProduct(id);
        setProduct(data);
      } else {
        // Demo mode
        const found = SAMPLE_PRODUCTS.find((p) => p.id === id);
        setProduct(found || null);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-somali-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-lg mx-auto px-6 text-center pt-20">
          <h1 className="font-display text-3xl font-bold text-gray-800 mb-3">Product Not Found</h1>
          <p className="text-gray-500 mb-6">This listing may have been removed or doesn&apos;t exist.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-somali-400 text-white font-semibold rounded-full">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const p = product;
  const images = p.images || [];
  const total = images.length;

  function goTo(i) {
    setCurrentImg(((i % total) + total) % total);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-somali-400 font-medium hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Images — Left */}
          <div className="lg:col-span-3">
            {/* Main image */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 group">
              {images.length > 0 ? (
                <div
                  className="w-full h-full bg-cover bg-center transition-all duration-500"
                  style={{ backgroundImage: `url(${images[currentImg]})` }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}

              {total > 1 && (
                <>
                  <button
                    onClick={() => goTo(currentImg - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => goTo(currentImg + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Price badge */}
              <span className="absolute top-4 right-4 px-4 py-1.5 bg-somali-400 text-white text-lg font-extrabold rounded-full shadow-lg">
                {formatPrice(p.price)}
              </span>
            </div>

            {/* Thumbnails */}
            {total > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-20 h-16 rounded-lg overflow-hidden bg-cover bg-center border-2 transition-all ${
                      i === currentImg ? 'border-somali-400 ring-2 ring-somali-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundImage: `url(${src})` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details — Right */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              {/* Category */}
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                  <Tag className="w-3 h-3" />
                  {p.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Eye className="w-3 h-3" />
                  {p.views_count || 0} views
                </span>
              </div>

              <h1 className="font-display font-bold text-2xl text-gray-900 leading-tight mb-2">
                {p.title}
              </h1>

              <div className="flex items-center gap-1.5 text-somali-400 text-sm font-semibold mb-4">
                <MapPin className="w-4 h-4" />
                {p.city}
              </div>

              <p className="text-3xl font-extrabold text-somali-500 mb-6">
                {formatPrice(p.price)} <span className="text-base font-normal text-gray-400">{p.currency}</span>
              </p>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{p.description}</p>
              </div>

              {/* Seller info */}
              <div className="border-t border-gray-100 pt-5 mb-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Seller</h3>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-somali-50 text-somali-400 flex items-center justify-center text-lg font-bold">
                    {p.seller_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{p.seller_name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Posted {timeAgo(p.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Call button */}
              <a
                href={`tel:${p.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20 text-base"
              >
                <Phone className="w-5 h-5" />
                Call Seller: {p.phone}
              </a>

              <p className="text-center text-[11px] text-gray-400 mt-3">
                Contact the seller directly to arrange pickup
              </p>

              {/* Share */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: p.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 mt-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:border-somali-300 hover:text-somali-500 transition-all text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share this listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
