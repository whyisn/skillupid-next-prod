import { supabaseAdmin } from '../../../lib/supabase-server';

export default async function CertificatePage({ params }){
  const code = params.code;
  let cert = null;
  try {
    const sb = supabaseAdmin();
    const { data } = await sb.from('certificates').select('*').eq('code', code).single();
    cert = data;
  } catch {}
  if(!cert){
    return <main className="max-w-3xl mx-auto px-4 py-12"><h1 className="text-2xl font-bold">Sertifikat tidak ditemukan.</h1></main>;
  }
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Verifikasi Sertifikat</h1>
      <p className="text-gray-600">Kode: <span className="font-mono">{cert.code}</span></p>
      <div className="mt-4 p-4 border rounded-xl">
        <div>Pengguna: <b>{cert.user_id}</b></div>
        <div>Kursus: <b>{cert.course_id}</b></div>
        <div>Diterbitkan: {new Date(cert.issued_at).toLocaleString()}</div>
        {cert.pdf_url && <a className="inline-block mt-3 underline" href={cert.pdf_url} target="_blank">Unduh Sertifikat (PDF)</a>}
      </div>
    </main>
  );
}
