// app/dashboard/DashboardClient.js
'use client';

import { Card } from '../../components/ui';
import Link from 'next/link';
// [TAMBAHAN] Impor ikon Clock
import { Clock } from 'lucide-react';

// --- [HELPER FUNCTIONS] ---
// Helper untuk format total durasi (X jam Y menit)
function formatDuration(totalSeconds) {
    if (!totalSeconds || totalSeconds < 0) totalSeconds = 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    let durationString = "";
    if (hours > 0) {
        durationString += `${hours} jam `;
    }
    if (minutes > 0 || (hours === 0 && minutes === 0)) {
        durationString += `${minutes} menit`;
    }
    return durationString.trim();
}

// Helper untuk format Rupiah
const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value || 0);

// --- [KOMPONEN UTAMA] ---

export default function DashboardClient({ userDisplayName, initialCourses = [] }) {
    
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Header dan Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <h2 className="text-2xl font-bold">Course Saya</h2>
                <div className="text-sm text-gray-500">
                    Selamat Datang Kembali, <span className="font-bold text-black">{userDisplayName}</span>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <div className='w-full sm:w-auto'>
                    <label htmlFor='filter-jenis' className='text-sm font-medium text-gray-700'>Pilih Jenis:</label>
                    <select id='filter-jenis' className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm">
                        <option>Semua Kelas</option>
                    </select>
                </div>
                <div className='w-full sm:w-auto'>
                    <label htmlFor='filter-cari' className='text-sm font-medium text-gray-700'>Pencarian:</label>
                    <input id='filter-cari' type="text" placeholder="Cari course..." className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm" />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {initialCourses.length > 0 ? (
                    initialCourses.map((course) => (
                        <Card key={course.id} className="p-0 overflow-hidden shadow-lg border border-gray-200 rounded-lg flex flex-col">
                            
                            {/* Thumbnail */}
                            <div className="aspect-video bg-gray-100">
                                {course.thumbnail_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full grid place-items-center text-gray-500">No Image</div>
                                )}
                            </div>
                            
                            {/* Info */}
                            <div className="p-4 space-y-3 flex-grow">
                                
                                {/* Baris 1: Kategori, Level & Harga */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-blue-600 uppercase">
                                        {course.category || "Kategori"} • {course.level || "Level"}
                                    </span>
                                    <span className="text-base font-bold text-green-600">
                                        {course.premium ? formatRupiah(course.price) : "Gratis"}
                                    </span>
                                </div>

                                {/* Baris 2: Judul Course */}
                                <h3 className="font-bold text-lg leading-tight text-gray-900 line-clamp-2">
                                    {course.title}
                                </h3>

                                {/* Baris 3: Durasi */}
                                <div className="flex justify-between items-center text-sm text-gray-600 pt-2">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" /> 
                                        {formatDuration(course.total_duration_seconds)}
                                    </span>
                                </div>

                                {/* [BARU] Progress Bar & Summary */}
                                <div className="pt-3 border-t mt-3">
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
                                        <span>Progress Course</span>
                                        <span className="text-black font-semibold">{course.progress_percent || 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full">
                                        <div 
                                            className="h-2 bg-[#1ABC9C] rounded-full transition-all duration-300" 
                                            style={{ width: `${course.progress_percent || 0}%` }} 
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{course.progress_summary || '0/1 item'}</p>
                                </div>

                            </div>

                            {/* Tombol Aksi */}
                            <div className="p-4 pt-0">
                                <Link href={`/learn/${course.id}`} legacyBehavior>
                                    <a className="block w-full text-center px-4 py-2 rounded-lg bg-[#1ABC9C] text-white font-semibold hover:bg-[#16a085] transition-colors">
                                        Masuk Course
                                    </a>
                                </Link>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        <p>Anda belum mendaftar course apapun.</p>
                        <Link href="/" legacyBehavior>
                            <a className="text-indigo-700 font-semibold mt-2">Cari course sekarang</a>
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}