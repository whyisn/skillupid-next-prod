import dayjs from 'dayjs';
import { supabaseAdmin } from './supabase-server.js';

/**
 * For production, install puppeteer (or @sparticuz/chromium for edge), then:
 * import puppeteer from 'puppeteer';
 * render HTML -> PDF -> upload to Supabase Storage.
 * Here we return a mock URL for local dev if puppeteer is not installed.
 */

export async function generateCertificatePDF({ userName, courseTitle, code }){
  const bucket = process.env.SUPABASE_CERT_BUCKET || 'certificates';
  // Fallback: simple PDF-less placeholder file
  const admin = supabaseAdmin();
  const content = Buffer.from(`Certificate\nName: ${userName}\nCourse: ${courseTitle}\nCode: ${code}\nIssued: ${dayjs().toISOString()}`);
  const path = `${code}.txt`;
  const { error } = await admin.storage.from(bucket).upload(path, content, { upsert: true, contentType: 'text/plain' });
  if(error) throw error;
  const { data } = admin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
