import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-server';
import { generateCertificatePDF } from '../../../../lib/certificates';
import crypto from 'crypto';

/**
 * Issue certificate for a user/course (requires SERVER auth; protect with middleware in production)
 * Body: { user_id, course_id, user_name, course_title }
 */
// export async function POST(req){
//   const { user_id, course_id, user_name, course_title } = await req.json();
//   if(!user_id || !course_id) return NextResponse.json({ error: 'user_id & course_id required' }, { status: 400 });
//   const code = crypto.randomBytes(6).toString('hex').toUpperCase();
//   const pdfUrl = await generateCertificatePDF({ userName: user_name || 'Student', courseTitle: course_title || 'Course', code });

//   const admin = supabaseAdmin();
//   const { data, error } = await admin.from('certificates').insert({ user_id, course_id, code, pdf_url: pdfUrl }).select().single();
//   if(error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json({ certificate: data });
// }

export async function POST(req){
  const { user_id, course_id, user_name, course_title } = await req.json();
  if(!user_id || !course_id)
    return NextResponse.json({ error: 'user_id & course_id required' }, { status: 400 });

  const code = crypto.randomBytes(6).toString('hex').toUpperCase();

  const pdfUrl = await generateCertificatePDF({
    userName: user_name || 'Student',
    courseTitle: course_title || 'Course',
    code
  });

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from('certificates')
    .insert({ user_id, course_id, code, pdf_url: pdfUrl })
    .select()
    .single();

  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ certificate: data });
}
