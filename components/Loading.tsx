// src/components/Loading.jsx
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="relative w-20 h-20">
        {/* Cincin 1 (Putar Kanan) */}
        <div className="absolute inset-0 border-4 border-[#324E74]/20 border-t-[#324E74] rounded-full animate-spin"></div>
        
        {/* Cincin 2 (Putar Kiri - Lebih Kecil) */}
        <div className="absolute inset-3 border-4 border-[#324E74]/20 border-b-[#324E74] rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        
        {/* Titik Tengah */}
        <div className="absolute inset-[38%] bg-[#324E74] rounded-full animate-pulse"></div>
      </div>
      <p className="mt-6 text-[#324E74] font-semibold tracking-wider text-xs">
        Latihan.ID
      </p>
    </div>
  );
}