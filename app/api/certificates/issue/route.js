// app/api/certificates/issue/route.js
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-server';
import { generateCertificatePDF } from '../../../../lib/certificates';
import crypto from 'crypto';

export async function POST(req){
  const { user_id, course_id, user_name, course_title } = await req.json(); 
  
  if(!user_id || !course_id)
    return NextResponse.json({ error: 'user_id & course_id required' }, { status: 400 });

  const admin = supabaseAdmin();
  
  // --- 1. CHECK FOR EXISTING CERTIFICATE ---
  const { data: existingCert, error: checkError } = await admin
    .from('certificates')
    .select('id, code, pdf_url') // Ambil data yang dibutuhkan
    .eq('user_id', user_id)
    .eq('course_id', course_id)
    .maybeSingle();

  if (checkError) {
      console.error("Certificate check error:", checkError.message);
      return NextResponse.json({ error: checkError.message || "Gagal mengecek sertifikat." }, { status: 500 });
  }

  if (existingCert) {
      // 2. IF EXISTS: Kembalikan data sertifikat yang sudah ada.
      console.log(`Certificate already exists for user ${user_id} and course ${course_id}. Returning existing record.`);
      return NextResponse.json({ certificate: existingCert });
  }
  // ------------------------------------------


  // --- 3. IF NOT EXISTS: PROCEED WITH GENERATION ---

  // Fetch the authoritative full name from the profiles table
  const { data: profile } = await admin
    .from('profiles')
    .select('full_name')
    .eq('id', user_id)
    .maybeSingle();

  const finalUserName = profile?.full_name || user_name || 'Student';

  // Generate new code
  const code = crypto.randomBytes(6).toString('hex').toUpperCase();

  // Generate and upload PDF
  const pdfUrl = await generateCertificatePDF({
    userName: finalUserName,
    courseTitle: course_title || 'Course',
    code
  });

  // Insert new record
  const { data, error } = await admin
    .from('certificates')
    .insert({ user_id, course_id, code, pdf_url: pdfUrl })
    .select('id, code, pdf_url') // Select field yang sama
    .single();

  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  // Return the newly created certificate data
  return NextResponse.json({ certificate: data });
}