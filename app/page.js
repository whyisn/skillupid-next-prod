// app/page.js
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";

export default async function Home() {
  const supabase = createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id,title,category,level,price,premium,rating,thumbnail_url")
    .order("title", { ascending: true });

    const heroImage = process.env.NEXT_PUBLIC_HERO_IMAGE_URL;

  return (
    <main>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Tingkatkan Skill Digitalmu dalam 10 Menit per Hari
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Microlearning interaktif, kuis, dan sertifikat digital yang bisa diverifikasi publik.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="/auth/sign-in" className="px-5 py-3 rounded-xl bg-black text-white">
                Mulai Gratis
              </a>
              <a href="#catalog" className="px-5 py-3 rounded-xl border border-gray-300">
                Lihat Katalog
              </a>
            </div>
          </div>
          {/* <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center text-gray-500">
            Preview materi & sertifikat
          </div> */}
          <div className="aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt="Preview materi & sertifikat"
                className="w-full h-full object-cover"
                loading="eager"
                fetchpriority="high"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-gray-500 bg-gradient-to-br from-gray-100 to-gray-200">
                Preview materi & sertifikat
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Katalog */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Katalog Kursus</h2>
          <a href="/dashboard" className="text-sm underline">Dashboard</a>
        </div>
        {(!courses || courses.length === 0) ? (
          <div className="p-10 text-center text-gray-600 border rounded-xl">
            Belum ada kursus. Tambahkan dari Admin Panel, atau seed tabel <code>courses</code>.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </section>

      {/* Pricing ringkas */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold mb-4">Harga</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-2xl">
            <h3 className="text-xl font-semibold">Gratis</h3>
            <p className="text-gray-600 mt-2">Akses kursus dasar & beberapa modul.</p>
            <div className="mt-6">
              <a href="/auth/sign-in" className="px-4 py-2 rounded-xl border">Mulai Gratis</a>
            </div>
          </div>
          <div className="p-6 border rounded-2xl">
            <h3 className="text-xl font-semibold">Premium</h3>
            <p className="text-gray-600 mt-2">Akses penuh semua materi + sertifikat.</p>
            <div className="mt-6">
              <a href="#catalog" className="px-4 py-2 rounded-xl bg-black text-white">Beli Kursus</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ singkat */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl">
            <h4 className="font-semibold">Apakah dapat sertifikat?</h4>
            <p className="text-gray-600 mt-1">Ya, setelah menyelesaikan kursus & lulus kuis.</p>
          </div>
          <div className="p-6 border rounded-xl">
            <h4 className="font-semibold">Apakah ada kelas gratis?</h4>
            <p className="text-gray-600 mt-1">Ada. Kamu bisa mulai tanpa bayar.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
