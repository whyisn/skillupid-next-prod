// app/sertifikat/page.js
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Download, Search, Calendar, User, Hash, ArrowLeft } from "lucide-react";

export default async function SertifikatPage() {
  const supabase = createClient();

  // 1. Cek User Login
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) redirect("/auth/sign-in");

  // 2. Ambil Data Sertifikat (Join Course & Profile untuk Nama)
  const { data: certificates = [] } = await supabase
    .from("certificates")
    .select(`
      id, code, pdf_url, issued_at,
      courses:course_id ( title ),
      profiles:user_id ( full_name )
    `)
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  // Helper tanggal format Indonesia
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      {/* Header & Navigasi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Sertifikat Saya
          </h1>
          <p className="text-gray-500 mt-1">
            Koleksi bukti kelulusan dan pencapaian kompetensi Anda.
          </p>
        </div>

        {/* Search Bar (Visual Saja) */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari sertifikat..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition duration-150 ease-in-out"
          />
        </div>
      </div>

      {/* Grid Layout (Mengikuti Style Dashboard) */}
      {(certificates || []).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Hash className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Belum ada sertifikat</h3>
          <p className="text-gray-500 mt-1 max-w-sm mx-auto">
            Selesaikan kursus dan kuis untuk mendapatkan sertifikat pertama Anda.
          </p>
          <div className="mt-6">
            <a href="/catalog" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none">
              Jelajahi Kursus
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => {
            const courseTitle = cert.courses?.title || "Unknown Course";
            const userName = cert.profiles?.full_name || user.email;

            return (
              <div 
                key={cert.id} 
                className="flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* 1. IFRAME PREVIEW (HEADER KARTU) */}
                <div className="relative w-full h-56 bg-gray-100 border-b border-gray-100">
                  {cert.pdf_url ? (
                    <>
                      <iframe
                        src={`${cert.pdf_url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        className="w-full h-full border-0 pointer-events-none"
                        title={`Sertifikat ${cert.code}`}
                        loading="lazy"
                        scrolling="no"
                      />
                      {/* Overlay Transparan */}
                      <div className="absolute inset-0 z-10 bg-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <span className="text-sm font-medium">Preview tidak tersedia</span>
                    </div>
                  )}
                  
                  {/* Badge Status */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                      Verified
                    </span>
                  </div>
                </div>

                {/* 2. KONTEN KARTU */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Judul Kursus */}
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1 leading-snug" title={courseTitle}>
                    {courseTitle}
                  </h3>

                  <div className="mt-3 space-y-2 text-sm text-gray-600 flex-1">
                    {/* Nama Peserta */}
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="truncate font-medium text-gray-800">{userName}</span>
                    </div>

                    {/* Kode Sertifikat */}
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                        {cert.code}
                      </span>
                    </div>

                    {/* Tanggal Terbit */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(cert.issued_at)}</span>
                    </div>
                  </div>

                  {/* Tombol Action */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <a
                      href={cert.pdf_url}
                      target="_blank"
                      download={`Sertifikat-${cert.code}.pdf`}
                      className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors gap-2 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Unduh PDF
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}