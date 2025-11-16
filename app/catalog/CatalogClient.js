'use client';

import Link from 'next/link';
import CourseCard from '@/components/CourseCard'; 

// Fungsi helper untuk styling tombol aktif
const getButtonClass = (isActive) => {
  return isActive
    ? "px-4 py-2 rounded-full bg-black text-white"
    : "px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200";
};

// Objek untuk menyimpan teks deskripsi
const descriptions = {
  semua: "Mulai dengan 10 menit per hari dan temukan kelas yang tepat untuk meningkatkan skill digitalmu setiap harinya. Pilih materi yang sesuai dengan tujuanmu—mulai dari desain, pemrograman, hingga cyber security. Semua dapat kamu pelajari kapan saja dan di mana saja",
  gratis: "Kembangkan kemampuanmu melalui kelas gratis yang bisa kamu akses kapan saja. Selesaikan semua modul dan kuis untuk memperoleh Sertifikat Penyelesaian resmi. Cocok untuk menambah portofolio dan CV kamu!",
  premium: "Dapatkan akses penuh ke semua materi mendalam, studi kasus nyata, dan latihan komprehensif. Setelah menyelesaikan kelas, kamu akan mendapatkan sertifikat terverifikasi untuk memperkuat portofolio profesionalmu. Belajar lebih lengkap, hasil lebih maksimal!"
};

export default function CatalogClient({ courses, activeFilter }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Judul dan Tombol Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">Belajar Apa Hari Ini?</h1>
        <div className="flex items-center gap-3">
          <Link 
            href="/catalog" 
            className={getButtonClass(activeFilter === 'semua')}
          >
            Semua
          </Link>
          <Link 
            href="/catalog?filter=gratis"
            className={getButtonClass(activeFilter === 'gratis')}
          >
            Gratis
          </Link>
          <Link 
            href="/catalog?filter=premium"
            className={getButtonClass(activeFilter === 'premium')}
          >
            Premium
          </Link>
        </div>
      </div>

      {/* === INI BAGIAN YANG DITAMBAHKAN === */}
      <p className="text-center text- text-gray-600 max-w-4xl mx-auto mb-10">
        {descriptions[activeFilter]}
      </p>
      {/* ================================== */}

      {/* Daftar Kursus */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16">
          <p>Tidak ada kursus yang ditemukan untuk filter &quot;{activeFilter}&quot;.</p>
        </div>
      )}
    </div>
  );
}