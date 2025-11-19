// app/cert/[code]/page.js
import { createClient } from "@/lib/supabase/server";

export default async function CertVerify({ params }) {
  const supabase = createClient();

  const { data: cert } = await supabase
    .from("certificates")
    .select("id,code,user_id,course_id,pdf_url,issued_at, profile:profiles(full_name), course:courses(title)")
    .eq("code", params.code)
    .maybeSingle();

  if (!cert) {
    return <div className="max-w-3xl mx-auto p-8">Sertifikat tidak ditemukan.</div>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">Verifikasi Sertifikat</h1>
        <div className="space-y-2 text-gray-700">
          <div><span className="font-medium">Kode:</span> {cert.code}</div>
          <div><span className="font-medium">Nama:</span> {cert.profile?.full_name || cert.user_id}</div>
          <div><span className="font-medium">Kursus:</span> {cert.course?.title || cert.course_id}</div>
          <div><span className="font-medium">Terbit:</span> {new Date(cert.issued_at).toLocaleDateString("id-ID")}</div>
        </div>

        <div className="mt-6">
          {cert.pdf_url ? (
            <a href={cert.pdf_url} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-black text-white">Unduh PDF</a>
          ) : (
            <div className="text-sm text-gray-500">PDF belum tersedia.</div>
          )}
        </div>
      </div>
    </main>
  );
}
