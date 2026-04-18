'use client';

import { Star,StarHalf, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TestimonialSection() {
  const { t } = useTranslation();

  // PERBAIKAN: Pindahkan definisi data ke DALAM komponen
  // agar fungsi t() bisa bekerja.
  const singleTestimonial = {
    id: 1,
    name: t("testimonials.name"),
    role: t("testimonials.role"),
    content: t("testimonials.description"),
    rating: 4,
  };

  return (
    <section
      id="testimonials"
      className="py-20 bg-white relative overflow-hidden rounded-4xl"
    >
      <div className="mx-auto px-6 relative z-10 text-center">
        {/* Ikon Quote dengan Animasi */}
        <div className="flex justify-center mb-8">
          {/* Wrapper Relative agar ring outline bisa diposisikan absolute di tengah */}
          <div className="relative flex items-center justify-center">
            {/* --- Outline Ring 1 (Zoom duluan) --- */}
            <div
              className="
                absolute w-full h-full rounded-full 
                border-2 border-[#324E74]/50
                animate-[ripple_2s_linear_infinite]
              "
            ></div>

            {/* --- Outline Ring 2 (Zoom belakangan/delay) --- */}
            <div
              className="
                absolute w-full h-full rounded-full 
                border-2 border-[#324E74]/50
                animate-[ripple_2s_linear_infinite]
                [animation-delay:1s] 
              "
            ></div>

            {/* --- Lingkaran Utama (Icon) --- */}
            <div
              className="
                relative z-10 
                w-20 h-20 
                bg-[#324E74] 
                rounded-full 
                flex items-center justify-center 
                shadow-lg shadow-blue-900/30
                /* Animasi Pulse Utama (opsional, biar ikonnya ikut 'bernafas') */
                animate-[premiumPulse_2s_ease-in-out_infinite]
              "
            >
              <Quote className="w-10 h-10 text-white fill-current" />
            </div>
          </div>

          {/* --- CSS Inject --- */}
          <style>{`
            /* Animasi Outline Zoom (Ripple) */
            @keyframes ripple {
              0% {
                transform: scale(1);
                opacity: 0.8;
              }
              100% {
                transform: scale(2.5); /* Membesar sampai 2.5x lipat */
                opacity: 0;            /* Menghilang */
              }
            }

            /* Animasi Tombol Utama (Bernafas) */
            @keyframes premiumPulse {
              0% { transform: scale(1); }
              50% { transform: scale(0.95); } /* Sedikit mengecil saat ring keluar */
              100% { transform: scale(1); }
            }
          `}</style>
        </div>

        {/* Rating Stars */}
       {/* Ubah rating di data Anda menjadi 4.5 */}
        {/* const singleTestimonial = { ..., rating: 4.5 }; */}

        <div className="flex justify-center gap-1 mb-8 z-10">
          {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1; // 1, 2, 3, 4, 5

            return (
              <span key={i}>
                {/* KONDISI 1: Bintang Penuh (Contoh: Rating 4.5, i=0,1,2,3) */}
                {singleTestimonial.rating >= ratingValue ? (
                  <Star
                    size={24}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ) : 
                /* KONDISI 2: Bintang Setengah (Contoh: Rating 4.5, i=4) */
                singleTestimonial.rating >= ratingValue - 0.5 ? (
                  <StarHalf
                    size={24}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ) : (
                /* KONDISI 3: Bintang Kosong */
                  <Star size={24} className="text-gray-300" />
                )}
              </span>
            );
          })}
        </div>

        {/* Isi Testimoni */}
        <blockquote className="text-lg md:text-xl font-medium text-gray-900 leading-snug tracking-tight mb-10 max-w-4xl mx-auto">
          &ldquo;{singleTestimonial.content}&rdquo;
        </blockquote>

        {/* Nama & Role */}
        <div className="inline-block border-t-2 border-gray-100 pt-6 px-10">
          <cite className="not-italic flex flex-col items-center">
            <span className="text-xl font-bold text-[#324E74]">
              {singleTestimonial.name}
            </span>
            <span className="text-gray-500 font-medium mt-1">
              {singleTestimonial.role}
            </span>
          </cite>
        </div>
      </div>
    </section>
  );
}
