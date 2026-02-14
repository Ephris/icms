'use client';

import Link from 'next/link';
import { MapPin, Phone, Eye } from 'lucide-react';
import ImageSlider from './ImageSlider';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function formatPrice(price) {
  return price >= 1000 ? `$${price.toLocaleString()}` : `$${price}`;
}

export default function ProductCard({ product }) {
  const p = product;
  const initial = p.seller_name?.[0]?.toUpperCase() || '?';

  return (
    <article className="product-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-up">
      <Link href={`/product/${p.id}`} className="block">
        {/* Image slider */}
        <div className="relative">
          <ImageSlider images={p.images} alt={p.title} />

          {/* Category badge */}
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold uppercase tracking-wide rounded-full">
            {p.category}
          </span>

          {/* Price badge */}
          <span className="absolute top-3 right-3 z-10 px-3 py-1 bg-somali-400 text-white text-sm font-extrabold rounded-full shadow-lg shadow-somali-400/30">
            {formatPrice(p.price)}
          </span>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-[15px] leading-snug truncate mb-1">
            {p.title}
          </h3>

          <div className="flex items-center gap-1 text-somali-400 text-xs font-semibold mb-2.5">
            <MapPin className="w-3.5 h-3.5" />
            {p.city}
          </div>

          <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-2 mb-3.5">
            {p.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-somali-50 text-somali-400 flex items-center justify-center text-xs font-bold">
                {initial}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 leading-none">{p.seller_name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(p.created_at)}</p>
              </div>
            </div>

            <a
              href={`tel:${p.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 text-white text-xs font-semibold rounded-full hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>
          </div>
        </div>
      </Link>
    </article>
  );
}
