import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";

// Icons dari lucide-react untuk Keunggulan Kompetitif + Bidang Pembelajaran
import {
  Clock,
  DollarSign,
  Award,
  CheckCircle,
  Smartphone,
  Lock,
  PenTool,
  Video,
  ShieldAlert,
  Network,
  CodeXml,
  Bot,
} from "lucide-react";

export default async function Home() {
  const supabase = createClient();

  // Ambil 6 kursus
  const { data: courses } = await supabase
    .from("courses")
    .select("id,title,category,level,price,premium,rating,thumbnail_url")
    .order("title", { ascending: true })
    .limit(6);

  const heroImage = process.env.NEXT_PUBLIC_HERO_IMAGE_URL;

  // ================================
  // BIDANG PEMBELAJARAN (IKON BERBEDA + MODERN CARD)
  // ================================
  const learningFields = [
    {
      title: "Cyber Security",
      Icon: ShieldAlert,
    },
    {
      title: "UI / UX",
      Icon: PenTool,
    },
    {
      title: "Desain Grafis dan Video Editor",
      Icon: Video,
    },
  
    {
      title: "Programming",
      Icon: CodeXml,
    },
    {
      title: "Internet of Things dan Robotika",
      Icon: Bot,
    },
    {
      title: "Networking",
      Icon: Network,
    },
    
  ];

  // ================================
  // DATA KEUNGGULAN
  // ================================
  const features = [
    {
      icon: Clock,
      title: "Microlearning Efektif",
      description:
        "Belajar efisien melalui video singkat berdurasi 5-15 menit per modul, ideal untuk Anda yang sibuk dan memiliki waktu terbatas.",
    },
    {
      icon: DollarSign,
      title: "Harga Terjangkau",
      description:
        "Biaya kursus premium lebih rendah dibanding pelatihan konvensional, menjadikannya mudah diakses oleh pelajar dan umum.",
    },
    {
      icon: Award,
      title: "Sertifikat Digital",
      description: "Dapatkan sertifikat digital yang dapat diverifikasi publik untuk memperkuat CV, portofolio, dan profil LinkedIn Anda.",
    },
    {
      icon: CheckCircle,
      title: "Konten Relevan",
      description: "Materi disesuaikan dengan tren industri digital Indonesia.",
    },
    {
      icon: Smartphone,
      title: "Akses Fleksibel 24/7",
      description: "Belajar kapan pun dan di mana pun melalui perangkat desktop atau mobile.",
    },
    {
      icon: Lock,
      title: "Pembayaran Aman",
      description: "Sistem terintegrasi dengan Midtrans Payment Gateway untuk transaksi yang aman dan verifikasi pembayaran otomatis.",
    },
  ];

  // ================================
  // DATA FAQ
  // ================================
  const faqItems = [
    {
      q: "Apa itu konsep Microlearning yang diusung SkillUpID?",
      a: "Microlearning adalah metode belajar menggunakan modul singkat 5-15 menit.",
    },
    {
      q: "Apakah semua kursus berbayar?",
      a: "Tidak. Ada kursus gratis dengan model Freemium.",
    },
    {
      q: "Bagaimana cara mendapatkan sertifikat digital?",
      a: "Sertifikat diterbitkan setelah menyelesaikan 100% materi dan kuis.",
    },
    {
      q: "Apakah materi di SkillUpID relevan dengan industri?",
      a: "Ya. Materi mengikuti tren industri digital Indonesia.",
    },
  ];

  return (
    <main>
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
              Tingkatkan Skill Digitalmu dalam 10 Menit per Hari
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Microlearning interaktif, kuis, dan sertifikat digital yang bisa diverifikasi publik.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="/auth/sign-in"
                className="w-full sm:w-auto px-6 py-3 font-bold text-center rounded-xl bg-[#1ABC9C] text-white shadow-lg hover:bg-[#17c7a6] transition"
              >
                Mulai Gratis
              </a>

              <a
                href="#catalog"
                className="w-full sm:w-auto px-6 py-3 font-bold text-center rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-50 transition"
              >
                Lihat Katalog
              </a>
            </div>
          </div>

          <div className="aspect-video rounded-2xl overflow-hidden shadow-xl bg-gray-100">
            {heroImage ? (
              <img
                src={heroImage}
                alt="Preview Hero"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="grid place-items-center h-full text-gray-500">
                Preview materi & sertifikat
              </div>
            )}
          </div>
        </div>
      </section>

      {/* KATALOG */}
      <section
        id="catalog"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Kursus Pilihan untukmu
          </h2>
          <a href="/catalog"className="text-sm font-medium text-[#1ABC9C] hover:underline">Lihat Semua →</a>
        </div>

        {!courses || courses.length === 0 ? (
          <div className="p-10 text-center text-gray-600 border border-dashed rounded-xl bg-gray-50">
            Belum ada kursus. Tambahkan dari Admin Panel.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 6).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      {/* BENEFITS */}
      <section
        id="why-skillup"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-green-50/50 rounded-xl my-10"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Kenapa Harus Pilih <span className="text-[#1ABC9C]">SkillUpID</span>?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-start p-4 rounded-2xl bg-white/70 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#1ABC9C]/60 transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1ABC9C] to-emerald-500 text-white mb-3 shadow-md">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="text-gray-600 mt-1">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Pricing ringkas */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Model Pembelajaran Fleksibel</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Tier Card */}
          <div className="p-8 border-2 border-gray-100 rounded-3xl shadow-lg bg-white transition hover:shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900">Akses Gratis (Free Tier)</h3>
            <p className="text-sm font-semibold text-[#1ABC9C] mt-1">Sempurna untuk coba-coba</p>
            <p className="text-4xl font-extrabold mt-4">Rp0 <span className="text-base font-normal text-gray-500">/ selamanya</span></p>
            <p className="text-gray-600 mt-4">Termasuk:</p>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Kursus dasar (Introduction)</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Beberapa modul pilihan di kelas premium</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Sertifikat Digital</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Akses kuis interaktif</li>
            </ul>
            <div className="mt-8">
              <a href="/catalog?filter=gratis" className="block w-full text-center px-6 py-3 rounded-xl border border-gray-300 font-bold text-gray-800 hover:bg-gray-50 transition">
                Mulai Belajar Sekarang
              </a>
            </div>
          </div>
          {/* Premium Card */}
          <div className="p-8 border-2 border-[#1ABC9C] rounded-3xl shadow-xl bg-[#1ABC9C] text-white transition hover:shadow-2xl">
            <h3 className="text-2xl font-bold">Premium Penuh</h3>
            <p className="text-sm font-semibold mt-1">Membuka potensi penuh karier digital Anda</p>
            <p className="text-4xl font-extrabold mt-4">Rp20rb <span className="text-base font-normal opacity-80">/ per kursus</span></p>
            <p className="mt-4">Termasuk Semua Fitur Gratis, ditambah:</p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-yellow-300 mr-2" /> Kursus Lanjut (Real Case)</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-yellow-300 mr-2" /> Akses penuh semua modul premium</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-yellow-300 mr-2" /> Sertifikat Digital</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-yellow-300 mr-2" /> Akses kuis interaktif</li>
            </ul>
            <div className="mt-8">
              <a href="/catalog?filter=premium" className="block w-full text-center px-6 py-3 rounded-xl bg-white text-[#1ABC9C] font-bold shadow-md hover:bg-gray-100 transition">
                Lihat Kursus Premium
              </a>
            </div>
          </div>
        </div>
      </section>

{/* BIDANG PEMBELAJARAN */}
<section
  id="fields"
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
>
  <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
    Bidang Pembelajaran
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {learningFields.map(({ title, Icon }, index) => {
      const total = learningFields.length;
      const isLast = index === total - 1;
      const remainder = total % 3;

      // kalau sisa 1 di baris terakhir → taruh item terakhir di kolom ke-2 (tengah) di layar besar
      const centerLastOnLg =
        isLast && remainder === 1 ? "lg:col-start-2" : "";

      return (
        <div
          key={index}
          className={`group relative overflow-hidden p-4 md:p-5 w-full max-w-[260px] mx-auto border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-2xl hover:border-[#1ABC9C]/60 transition-all duration-300 ease-out hover:-translate-y-1 hover:-rotate-[0.25deg] cursor-pointer flex flex-col items-center ${centerLastOnLg}`}
        >
          {/* Accent glow background */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute -bottom-10 -right-10 h-20 w-20 rounded-full bg-[#1ABC9C]/10 blur-xl" />
          </div>

          {/* Icon bubble (sedikit lebih kecil) */}
          <div className="relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1ABC9C] to-emerald-500 text-white mb-3 shadow-md group-hover:shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
            <Icon className="w-5 h-5" />
          </div>

          <p className="text-sm font-semibold text-gray-900 text-center">
            {title}
          </p>
        </div>
      );
    })}
  </div>
</section>

      {/* FAQ */}
      <section
        id="faq"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
      >
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">
          Pertanyaan yang Sering Diajukan
        </h2>

        <div className="grid gap-4">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="group p-6 border border-gray-200 rounded-xl hover:border-[#1ABC9C] hover:shadow-lg transition"
            >
              <h4 className="font-semibold text-lg text-gray-800 group-hover:text-[#1ABC9C] flex justify-between cursor-pointer">
                {item.q}
                <svg
                  className="w-5 h-5 group-hover:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </h4>

              <p className="text-gray-600 mt-2 max-h-0 opacity-0 overflow-hidden group-hover:max-h-96 group-hover:opacity-100 transition-all duration-500">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
