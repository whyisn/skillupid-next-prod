// app/dashboard/DashboardClient.js
'use client';

// 1. Impor Link untuk navigasi
import Link from 'next/link';
import { Card } from '../../components/ui';

// 2. Terima 'initialEnrollments' sebagai prop
export default function DashboardClient({ userDisplayName, initialEnrollments }) {
  
  // 3. Hapus data 'progress' statis
  // const [progress] = useState([ ...data statis... ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Selamat Datang Kembali, <span className="font-bold text-gray-900">{userDisplayName}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <select className="rounded-xl border border-gray-300 p-2 text-sm">
          <option>Semua</option>
          <option>Berjalan</option>
          <option>Selesai</option>
        </select>
        <button className="rounded-2xl px-4 py-2 border border-gray-300">Unduh Sertifikat</button>
      </div>

      {/* 4. Render data dinamis dari 'initialEnrollments' */}
      {initialEnrollments.length === 0 ? (
        <div className="text-center text-gray-500 p-10 border border-dashed rounded-xl">
          <p>Anda belum mendaftar di kursus apa pun.</p>
          <Link href="/catalog" className="text-[#1ABC9C] font-semibold hover:underline mt-2 inline-block">
            Lihat Katalog Kursus
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {initialEnrollments.map((enrollment) => {
            const course = enrollment.courses; // Ambil data course
            const percent = enrollment.progress_percent || 0; // Ambil progress

            if (!course) return null; // Pengaman jika data course tidak ada

            return (
              <Card key={enrollment.id} className="p-4 flex flex-col">
                {/* Anda bisa tambahkan thumbnail di sini jika mau */}
                {/* <img src={course.thumbnail_url} alt={course.title} /> */}
                
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <span className="text-sm text-gray-600">{percent}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div 
                    className="h-2 bg-[#1ABC9C] rounded-full transition-all" 
                    style={{ width: `${percent}%` }} 
                  />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Link 
                    href={`/learn/${course.id}`}
                    className="rounded-xl px-3 py-2 bg-[#1ABC9C] text-white text-sm font-medium hover:bg-[#16a085] transition-colors"
                  >
                    Lanjutkan
                  </Link>
                  <Link 
                    href={`/courses/${course.id}`}
                    className="rounded-xl px-3 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Detail
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}