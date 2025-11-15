"use client";

// Komponen klien untuk menangani event browser seperti onError
// yang tidak bisa dihandle oleh Server Component (page.js)

// Fallback URL untuk placeholder jika gambar asli gagal dimuat
const FALLBACK_IMAGE_URL = 'https://placehold.co/64x64/f3f4f6/374151?text=Logo';

export default function LearningFieldCard({ field }) {
  // Fungsi untuk menangani error saat memuat gambar
  const handleImageError = (e) => {
    // Menonaktifkan event handler agar tidak terjadi loop error
    e.target.onerror = null;
    // Mengganti sumber gambar ke placeholder
    e.target.src = FALLBACK_IMAGE_URL;
  };

  return (
    <div 
      className="p-4 md:p-6 border border-gray-200 rounded-xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg transition duration-300 cursor-pointer bg-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={field.iconPath} 
        alt={field.title} 
        className="w-12 h-12 md:w-16 md:h-16 mb-3 object-contain" 
        // Event handler onError dipindahkan ke sini
        onError={handleImageError} 
      />
      <p className="text-sm font-semibold text-gray-800">{field.title}</p>
    </div>
  );
}