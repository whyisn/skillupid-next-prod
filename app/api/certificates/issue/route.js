// app/api/certificates/issue/route.js
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-server';
import { generateCertificatePDF } from '../../../../lib/certificates';
import crypto from 'crypto';

export async function POST(req){
  const { user_id, course_id, user_name, course_title } = await req.json(); // user_name dari client mungkin salah
  
  if(!user_id || !course_id)
    return NextResponse.json({ error: 'user_id & course_id required' }, { status: 400 });

  const admin = supabaseAdmin();
  
  // [BARU] 1. Ambil nama user yang BENAR dari tabel profiles menggunakan user_id
  const { data: profile } = await admin
    .from('profiles')
    .select('full_name')
    .eq('id', user_id)
    .maybeSingle();

  const finalUserName = profile?.full_name || user_name || 'Student';

  // 2. Lanjutkan proses pembuatan PDF dengan nama yang sudah diverifikasi
  const code = crypto.randomBytes(6).toString('hex').toUpperCase();

  const pdfUrl = await generateCertificatePDF({
    userName: finalUserName, // <-- Menggunakan nama yang sudah diverifikasi dari DB
    courseTitle: course_title || 'Course',
    code
  });

  // 3. Simpan data sertifikat ke DB
  const { data, error } = await admin
    .from('certificates')
    .insert({ user_id, course_id, code, pdf_url: pdfUrl })
    .select()
    .single();

  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ certificate: data });
}