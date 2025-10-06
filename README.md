# SkillUpID – Next.js (Production Template)

Stack: **Next.js 14 (App Router)** + **Tailwind** + **Supabase (Auth/Postgres/Storage)** + **Midtrans Webhook (payments)** + **Certificate generator** + **Video provider helper (Mux/Vimeo)**.

## Jalankan lokal
```bash
npm install
cp .env.example .env.local
npm run dev
# http://localhost:3000
```
> Minimal agar halaman jalan: env boleh kosong (mock data dipakai di katalog). Untuk API routes yang menyentuh Supabase/Payments/Storage, isi env lebih dulu.

## Deploy
- **Next.js**: Vercel (isi semua env di Project Settings).  
- **Supabase**: buat project, jalankan `db/schema.sql` di SQL editor, buat Storage bucket `certificates`.  
- **Payments**: set webhook Midtrans ke `https://YOUR_APP.vercel.app/api/webhooks/midtrans`.

## ENV yang penting
Lihat **.env.example**. Minimal untuk fitur produksi:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`
- `SUPABASE_CERT_BUCKET`
- `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION`
- `VIDEO_PROVIDER` dan kredensial Mux/Vimeo (opsional)

## Fitur yang disertakan
- Landing + Katalog (mock data).
- **/dashboard** (mock progress).
- **/api/webhooks/midtrans**: contoh verifikasi signature (`verifyMidtransSignature`). Lengkapi mapping `order_id` → `(user_id, course_id)` saat checkout.
- **/api/certificates/issue**: terbitkan sertifikat (membuat file di Supabase Storage; di template ini berupa TXT placeholder, ganti ke PDF via Puppeteer).
- **/cert/[code]**: halaman verifikasi sertifikat.
- **/lib/video.js**: helper embed video (Mux/Vimeo). Untuk Mux signed URL, buat route yang menandatangani playback URL.

## Ganti TXT → PDF
Di `lib/certificates.js`, ganti implementasi dengan Puppeteer untuk menghasilkan PDF dari HTML:
```js
// pseudo
import puppeteer from 'puppeteer';
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent('<html>...sertifikat...</html>');
const pdf = await page.pdf({ format: 'A4' });
await browser.close();
// upload 'pdf' Buffer ke Supabase Storage
```
Jika deploy di Vercel Edge/Serverless, gunakan paket seperti `@sparticuz/chromium` dan sesuaikan launch args.

## Skema Database
Tersedia di `db/schema.sql` (users, courses, modules, enrollments, progress, quizzes, questions, submissions, certificates, payments) plus RLS dasar.

## Catatan Penting
- **Auth UI** belum disertakan: gunakan `@supabase/auth-ui-react` atau halaman auth sendiri.  
- **Checkout**: integrasikan Midtrans Snap/Invoice di halaman kursus, lalu arahkan notifikasi ke webhook.  
- **Video**: simpan `video_id` per module; embed via Mux/Vimeo sesuai provider.  
- **Security**: tambahkan middleware untuk proteksi API internal (hanya admin/service). Tambahkan logging/monitoring (Sentry).

Selamat membangun! 🚀
