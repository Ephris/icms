'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageSlider({ images = [], alt = 'Product' }) {
  const [current, setCurrent] = useState(0);
  const total = images.length || 1;

  const goTo = useCallback(
    (i) => setCurrent(((i % total) + total) % total),
    [total]
  );

  if (!images.length) {
    return (
      <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400">
        No image
      </div>
    );
  }

  return (
    <div className="relative w-full h-56 overflow-hidden bg-gray-200 group">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="min-w-full h-full bg-cover bg-center bg-gray-300"
            style={{ backgroundImage: `url(${src})` }}
            role="img"
            aria-label={`${alt} photo ${i + 1}`}
          />
        ))}
      </div>

      {/* Nav buttons */}
      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(current - 1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(current + 1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i); }}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
