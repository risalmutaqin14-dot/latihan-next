'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { partnerLogos } from '../data';

export default function LogoCarousel() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId = 0;
    let scrollPosition = 0;
    const scrollSpeed = 0.3;
    const scrollWidth = scrollContainer.scrollWidth;

    // Cache scrollWidth untuk menghindari repeated DOM queries
    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      if (scrollPosition >= scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Pause saat hover - gunakan passive listener
    const handleMouseEnter = () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    scrollContainer.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const duplicatedLogos = [...partnerLogos, ...partnerLogos];

  return (
    <section className="mt-0 md:mt-18 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div 
            ref={scrollRef}
            data-scrollable
            className="overflow-hidden whitespace-nowrap"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="inline-flex gap-4 py-8">
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={`${logo.id}-${index}`}
                  className="inline-flex items-center justify-center w-48 h-32 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex-shrink-0"
                >
                  <div className=" rounded p-2">
                    <Image
                      src={logo.image}
                      alt={logo.name}
                      width={180}
                      height={64}
                      className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      style={{ width: 'auto', height: 'auto', maxWidth: '180px', maxHeight: '64px' }}
                      sizes="180px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        [data-scrollable]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

export { LogoCarousel as Partner };
