import { createClient } from "@/lib/supabase/server";
import EnrollActions from "./EnrollActions";

// --- Helper Functions (diletakkan di bawah) ---
// 1. formatDuration
// 2. formatModuleDuration
// 3. formatRupiah
// 4. InfoItem (komponen kecil)
// ----------------------------------------------

export default async function CourseDetail({ params }) {
  const supabase = createClient();

  // Ambil data kursus
  const { data: course } = await supabase
    .from("courses")
    .select("id,title,description,category,level,price,premium,rating,thumbnail_url")
    .eq("id", params.id)
    .maybeSingle();

  if (!course) {
    return <div className="max-w-5xl mx-auto p-6">Kursus tidak ditemukan.</div>;
  }

  // Ambil data modul
  const { data: modules } = await supabase
    .from("modules")
    .select("id,title,order_no,duration_seconds")
    .eq("course_id", course.id)
    .order("order_no");

  // Kalkulasi Total Durasi (DINAMIS dari data Supabase)
  const totalDurationInSeconds = modules?.reduce(
    (acc, mod) => acc + (mod.duration_seconds || 0),
    0
  ) || 0;
  
  const totalDurationFormatted = formatDuration(totalDurationInSeconds);

  // Data statis untuk benefit di sidebar
  const benefits = {
    free: [
      "Akses Selamanya",
      "Sertifikat Penyelesaian",
      "Materi To-The-Point",
      "Quiz Interaktif",
    ],
    premium: [
      "Akses Selamanya",
      "Akses Modul Premium",
      "Materi Real Case",
      "Praktik Langsung",
      "Sertifikat Penyelesaian",
      "Materi To-The-Point",
      "Quiz Interaktif",
    ]
  };
  
  const courseBenefits = course.premium ? benefits.premium : benefits.free;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. Top Header */}
      <div className="max-w-4xl">
        <h1 className="text-4xl font-extrabold text-gray-900">{course.title}</h1>
        <p className="mt-3 text-lg text-gray-600">
          {course.description?.split('.').slice(0, 2).join('.') + '.'}
        </p>
      </div>

      {/* === [PERUBAHAN DI SINI] 2. Info Bar (Sesuai Desain) === */}
      {/* Border kembali normal (tidak putus-putus), center-aligned */}
      <div className="mt-6 max-w-4xl mx-auto p-2 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
        {/* Menggunakan divide-x untuk garis pemisah */}
        <div className="flex flex-wrap items-stretch justify-center divide-x divide-gray-300">
          
          <InfoItem label="Total Durasi" value={totalDurationFormatted} />
          
          <InfoItem label="Kategori" value={course.category} />
          
          {/* ITEM BARU "AKSES" DITAMBAHKAN */}
          <InfoItem label="Akses" value={course.premium ? "Bayar" : "Gratis"} />

          <InfoItem label="Sertifikat">
            {/* Ikon checkmark hijau (Heroicon: check-circle outline) */}
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </InfoItem>
          
          <InfoItem label="Level" value={course.level} />
        
        </div>
      </div>
      {/* ====================================================== */}


      {/* 3. Main Content (2-Column) */}
      <div className="mt-10 grid lg:grid-cols-3 gap-10 lg:gap-12">
        
        {/* Kolom Kiri (Konten) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Thumbnail */}
          <div className="aspect-video rounded-2xl bg-gray-100 overflow-hidden shadow-lg">
            {course.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-gray-500">Preview</div>
            )}
          </div>

          {/* Tab "Tentang Kelas" */}
          <div>
            <div className="mb-4 border-b border-gray-200">
              <span className="px-6 py-3 font-semibold text-gray-900  bg-[#1ABC9C] rounded-t-lg">
                Tentang Kelas
              </span>
            </div>
            <div className="p-6 border border-gray-200 rounded-b-lg rounded-r-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Apa yang akan kamu pelajari?</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {course.description || "Deskripsi belum tersedia."}
              </p>
            </div>
          </div>

          {/* Daftar Modul */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Daftar Modul</h2>
            {(!modules || modules.length === 0) ? (
              <div className="p-6 border rounded-xl text-gray-600">Belum ada modul.</div>
            ) : (
              <ol className="space-y-3">
                {modules.map((m) => (
                  <li key={m.id} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between shadow-sm bg-white">
                    <div className="font-medium text-gray-800">{m.order_no}. {m.title}</div>
                    <div className="text-sm text-gray-900 font-mono bg-[#1abc9c61] px-2 py-1 rounded">
                      {/* Durasi dinamis MM:SS (DINAMIS dari dataSupabase) */}
                      {formatModuleDuration(m.duration_seconds)}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

        </div> 
        {/* End Kolom Kiri */}

        {/* Kolom Kanan (Sidebar Enroll) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 border border-gray-200 rounded-2xl shadow-lg bg-white">
            <h3 className="text-2xl font-bold text-gray-900">
              {course.premium ? formatRupiah(course.price) : "Gratis"}
            </h3>
            
            <ul className="mt-6 space-y-3 text-gray-700">
              {courseBenefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {/* Tombol EnrollActions diletakkan di sini */}
              <EnrollActions course={course} />
            </div>
          </div>
        </div> 
        {/* End Kolom Kanan */}

      </div> 
      {/* End Grid Utama */}
    </main>
  );
}

// --- Helper Functions ---

{/* === [PERUBAHAN DI SINI] Komponen helper kecil untuk Info Bar === */}
// Layout: Label di atas, Value di bawah. Warna kembali ke abu-abu.
function InfoItem({ label, value, children }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-2 md:px-8">
      <span className="text-xs text-gray-500 uppercase font-medium">{label}</span>
      <span className="text-base font-semibold text-gray-900 h-6 flex items-center">
        {value ? value : children}
      </span>
    </div>
  );
}
{/* ============================================================== */}

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

// Helper untuk format durasi modul (MM:SS)
function formatModuleDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds < 0) totalSeconds = 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Helper untuk format Rupiah (dibutuhkan untuk harga di sidebar)
const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);