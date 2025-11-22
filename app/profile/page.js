// // app/profile/page.js — Server Component (Next.js App Router)
// export const dynamic = "force-dynamic";

// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server"; 
// import { Download, Award } from "lucide-react";

// function formatIDR(n) {
//   try {
//     return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
//   } catch { return n; }
// }

// export default async function ProfilePage() {
//   const supabase = createClient();

//   // 1) Auth
//   let user = null;
//   try {
//     const { data, error } = await supabase.auth.getUser();
//     if (!error) user = data?.user ?? null;
//   } catch { user = null; }
//   if (!user) redirect("/auth/sign-in");

//   // 2) Profile
//   let profile = null;
//   const { data: profA } = await supabase.from("profiles").select("id, full_name, headline, avatar_url").eq("id", user.id).maybeSingle();
//   if (profA) profile = profA;
//   if (!profile) {
//     const { data: profB } = await supabase.from("users").select("id, full_name, headline, avatar_url").eq("id", user.id).maybeSingle();
//     if (profB) profile = profB;
//   }

//   // 3) Enrollments (FIXED QUERY)
//   // Hanya ambil kolom yang PASTI ADA di tabel enrollments Anda agar tidak error/null
//   const { data: enrollmentsData } = await supabase
//     .from("enrollments")
//     .select(`id, course_id, status`) 
//     .eq("user_id", user.id);
  
//   const enrollments = enrollmentsData || [];

//   // 4) Certificates
//   const { data: certificatesData } = await supabase
//     .from("certificates")
//     .select(`
//       id, code, pdf_url, issued_at,
//       courses:course_id ( title, thumbnail_url )
//     `)
//     .eq("user_id", user.id)
//     .order("issued_at", { ascending: false });

//   const certificates = certificatesData || [];

//   // 5) Payments
//   const { data: paymentsData } = await supabase
//     .from("payments")
//     .select("id, ref, course_title, amount, status, paid_at, created_at")
//     .eq("user_id", user.id)
//     .order("created_at", { ascending: false });

//   const payments = paymentsData || [];

//   const displayName = profile?.full_name || user.user_metadata?.name || user.email?.split("@")[0];
//   const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName || "User")}`;
//   const headline = profile?.headline || "Belajar 10 menit per hari";
  
//   // LOGIC BARU SESUAI REQUEST:
//   // Selesai = Jumlah Sertifikat
//   const completedCount = certificates.length;

//   return (
//     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
//       <nav className="text-sm text-gray-500 mb-5">
//         <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
//         <span className="mx-2">/</span>
//         <span className="text-gray-700">Profil</span>
//       </nav>

//       {/* Header */}
//       <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
//         <div className="flex flex-col md:flex-row md:items-center gap-5">
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full ring-4 ring-emerald-50" />
//           <div className="flex-1">
//             <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{displayName}</h1>
//             <p className="text-gray-600 mt-1">{user.email}</p>
//             <p className="text-gray-500 text-sm mt-1">{headline}</p>
//           </div>
//           <div className="flex gap-2">
//             <a href="/dashboard" className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90">Lanjut Belajar</a>
//             <form action="/api/logout" method="POST">
//               <button type="submit" className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">Keluar</button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Grid */}
//       <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Kiri */}
//         <div className="space-y-6">
//           {/* BAGIAN RINGKASAN BELAJAR (LOGIC DIPERBAIKI) */}
//           <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
//             <h2 className="text-lg md:text-xl font-semibold">Aktivitas</h2>
//             <p className="text-sm text-gray-500 mt-1">Ringkasan Belajar</p>
//             <div className="grid grid-cols-3 gap-4 text-center mt-4">
//               <div className="bg-emerald-50 rounded-xl p-4">
//                 {/* Logic: Jumlah data di tabel enrollments */}
//                 <div className="text-2xl font-bold">{enrollments.length}</div>
//                 <div className="text-xs text-gray-600 mt-1">Course</div>
//               </div>
//               <div className="bg-amber-50 rounded-xl p-4">
//                 {/* Logic: Sama dengan jumlah sertifikat */}
//                 <div className="text-2xl font-bold">{completedCount}</div>
//                 <div className="text-xs text-gray-600 mt-1">Selesai</div>
//               </div>
//               <div className="bg-indigo-50 rounded-xl p-4">
//                 <div className="text-2xl font-bold">{certificates.length}</div>
//                 <div className="text-xs text-gray-600 mt-1">Sertifikat</div>
//               </div>
//             </div>
//           </section>

//           <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
//             <h2 className="text-lg md:text-xl font-semibold">Profil Saya</h2>
//             <p className="text-sm text-gray-500 mt-1">Data diambil dari database</p>
//             <dl className="mt-4 grid grid-cols-1 gap-3">
//               <div className="grid grid-cols-3 gap-2 items-center">
//                 <dt className="text-sm text-gray-500">Nama</dt>
//                 <dd className="col-span-2 font-medium">{displayName}</dd>
//               </div>
//               <div className="grid grid-cols-3 gap-2 items-center">
//                 <dt className="text-sm text-gray-500">Email</dt>
//                 <dd className="col-span-2">{user.email}</dd>
//               </div>
//               <div className="grid grid-cols-3 gap-2 items-center">
//                 <dt className="text-sm text-gray-500">Headline</dt>
//                 <dd className="col-span-2">{headline}</dd>
//               </div>
//               <div className="pt-3">
//                 <a href="/settings" className="inline-flex px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">Kelola Profil</a>
//               </div>
//             </dl>
//           </section>

//           <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
//             <h2 className="text-lg md:text-xl font-semibold">Keamanan</h2>
//             <p className="text-sm text-gray-500 mt-1">Atur kata sandi dan 2FA</p>
//             <div className="space-y-3 mt-4">
//               <a className="block w-full px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-left" href="/auth/change-password">Ubah Kata Sandi</a>
//               <a className="block w-full px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-left" href="/settings/security">Aktifkan Authenticator (2FA)</a>
//             </div>
//           </section>
//         </div>

//         {/* Kanan */}
//         <div className="lg:col-span-2 space-y-6">
//           <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <h2 className="text-lg md:text-xl font-semibold">Belajar Apa Hari Ini??</h2>
//                 <p className="text-sm text-gray-500 mt-1">Cari kelas sesuai dengan minat anda</p>
//               </div>
//               <a href="/catalog" className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm">Jelajahi Kursus</a>
//             </div>
//             <div className="grid sm:grid-cols-2 gap-4 mt-4">
//               <p className="text-sm text-gray-500">Saatnya memulai!</p>
//             </div>
//           </section>

//           {/* SERTIFIKAT (IFRAME PDF) */}
//           <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
//             <div className="flex items-start justify-between gap-3 mb-4">
//               <div>
//                 <h2 className="text-lg md:text-xl font-semibold">Sertifikat</h2>
//                 <p className="text-sm text-gray-500 mt-1">Unduh Sertifikat & Perbarui Portofolio Anda</p>
//               </div>
//               <a href="/sertifikat" className="text-sm underline">Lihat Semua</a>
//             </div>

//             {certificates.length === 0 ? (
//               <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
//                  <p className="text-gray-500 text-sm">Belum ada sertifikat. Selesaikan kursus untuk mendapatkannya.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {certificates.map((cert) => {
//                   const courseData = cert.courses || {}; 
//                   return (
//                     <div key={cert.id} className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
//                       {/* IFRAME PREVIEW */}
//                       <div className="relative h-40 w-full bg-gray-100 overflow-hidden border-b border-gray-100">
//                         {cert.pdf_url ? (
//                             <>
//                               <iframe 
//                                 src={`${cert.pdf_url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
//                                 className="w-full h-full border-0 pointer-events-none" 
//                                 title={`Preview Sertifikat ${cert.code}`}
//                                 loading="lazy" 
//                                 scrolling="no"
//                               />
//                               <div className="absolute inset-0 z-10 bg-transparent" />
//                             </>
//                         ) : (
//                           <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-600">
//                              <Award className="w-12 h-12 mb-2 opacity-80" />
//                              <span className="text-xs font-bold tracking-widest uppercase opacity-70">Certificate</span>
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-4 flex flex-col flex-1">
//                         <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 leading-snug min-h-[2.5rem]" title={courseData.title}>
//                           {courseData.title || "Judul Kursus Tidak Ditemukan"}
//                         </h3>
//                         <p className="text-xs text-gray-500 mb-4 font-mono">ID: {cert.code}</p>
//                         <div className="mt-auto pt-3 border-t border-gray-100">
//                           {cert.pdf_url ? (
//                             <a 
//                               href={cert.pdf_url} target="_blank" download={`Sertifikat-${cert.code}.pdf`}
//                               className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
//                             >
//                               <Download className="w-4 h-4" /> Unduh PDF
//                             </a>
//                           ) : (
//                             <button disabled className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed">Memproses...</button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </section>

//           {/* PEMBAYARAN */}
//           <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
//             <h2 className="text-lg md:text-xl font-semibold">Pembayaran</h2>
//             <div className="overflow-x-auto mt-4">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-500">
//                     <th className="py-2 pr-4">Invoice</th>
//                     <th className="py-2 pr-4">Kursus</th>
//                     <th className="py-2 pr-4">Jumlah</th>
//                     <th className="py-2 pr-4">Status</th>
//                     <th className="py-2 pr-4">Tanggal</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {payments.map((p) => (
//                     <tr key={p.id} className="border-t">
//                       <td className="py-2 pr-4 font-mono">{p.ref}</td>
//                       <td className="py-2 pr-4">{p.course_title}</td>
//                       <td className="py-2 pr-4">{formatIDR(p.amount)}</td>
//                       <td className="py-2 pr-4">
//                         <span className={`px-2.5 py-1 rounded-full text-xs ${p.status === "settlement" ? "bg-emerald-50 text-emerald-700" : p.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-700"}`}>
//                           {p.status}
//                         </span>
//                       </td>
//                       <td className="py-2 pr-4">{p.paid_at ? new Date(p.paid_at).toLocaleString("id-ID") : "-"}</td>
//                     </tr>
//                   ))}
//                   {payments.length === 0 && (
//                     <tr><td colSpan={5} className="py-3 text-sm text-gray-500">Belum ada transaksi.</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </div>
//       </div>
//     </main>
//   );
// }

// app/profile/page.js — Server Component (Next.js App Router)
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Download, Award } from "lucide-react";

function formatIDR(n) {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return n;
  }
}

export default async function ProfilePage() {
  const supabase = createClient();

  // 1) Auth
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) user = data?.user ?? null;
  } catch {
    user = null;
  }
  if (!user) redirect("/auth/sign-in");

  // 2) Profile
  let profile = null;
  const { data: profA } = await supabase
    .from("profiles")
    .select("id, full_name, headline, avatar_url")
    .eq("id", user.id)
    .maybeSingle();
  if (profA) profile = profA;
  if (!profile) {
    const { data: profB } = await supabase
      .from("users")
      .select("id, full_name, headline, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    if (profB) profile = profB;
  }

  // 3) Enrollments + info course (supaya bisa dipakai di history pembayaran)
  const { data: enrollmentsData } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      course_id,
      status,
      created_at,
      courses:course_id ( title, price )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const enrollments = enrollmentsData || [];

  // 4) Certificates
  const { data: certificatesData } = await supabase
    .from("certificates")
    .select(`
      id, code, pdf_url, issued_at,
      courses:course_id ( title, thumbnail_url )
    `)
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  const certificates = certificatesData || [];

  // 5) Payments (transaksi berbayar)
  const { data: paymentsData } = await supabase
    .from("payments")
    .select(
      "id, ref, course_id, course_title, amount, status, paid_at, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const payments = paymentsData || [];

  // 6) Gabungkan: payments + enrollments (gratis / tidak ada record payment)
  const paidCourseIds = new Set(
    payments.map((p) => p.course_id).filter(Boolean)
  );

  const syntheticEnrollPayments = enrollments
    .filter((e) => !paidCourseIds.has(e.course_id))
    .map((e) => {
      const course = e.courses || {};
      const price = course?.price ?? 0;
      const isFree = !price || price <= 0;

      return {
        id: `enroll-${e.id}`,
        ref: (e.id || "").slice(0, 8).toUpperCase(), // kode invoice pseudo
        course_id: e.course_id,
        course_title: course.title || e.course_id,
        amount: price || 0,
        status: isFree ? "gratis" : e.status || "enrolled",
        paid_at: null,
        created_at: e.created_at,
      };
    });

  const paymentHistory = [...payments, ...syntheticEnrollPayments].sort(
    (a, b) =>
      new Date(b.created_at || b.paid_at || 0) -
      new Date(a.created_at || a.paid_at || 0)
  );

  const displayName =
    profile?.full_name || user.user_metadata?.name || user.email?.split("@")[0];
  const avatarUrl =
    profile?.avatar_url ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      displayName || "User"
    )}`;
  const headline = profile?.headline || "Belajar 10 menit per hari";

  // Selesai = Jumlah Sertifikat
  const completedCount = certificates.length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <nav className="text-sm text-gray-500 mb-5">
        <a href="/dashboard" className="hover:text-gray-700">
          Dashboard
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Profil</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-20 h-20 rounded-full ring-4 ring-emerald-50"
          />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {displayName}
            </h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
            <p className="text-gray-500 text-sm mt-1">{headline}</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
            >
              Lanjut Belajar
            </a>
            <form action="/api/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kiri */}
        <div className="space-y-6">
          {/* Aktivitas */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold">Aktivitas</h2>
            <p className="text-sm text-gray-500 mt-1">Ringkasan Belajar</p>
            <div className="grid grid-cols-3 gap-4 text-center mt-4">
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="text-2xl font-bold">{enrollments.length}</div>
                <div className="text-xs text-gray-600 mt-1">Course</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="text-xs text-gray-600 mt-1">Selesai</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="text-2xl font-bold">{certificates.length}</div>
                <div className="text-xs text-gray-600 mt-1">Sertifikat</div>
              </div>
            </div>
          </section>

          {/* Profil */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold">Profil Saya</h2>
            <p className="text-sm text-gray-500 mt-1">Data diambil dari database</p>
            <dl className="mt-4 grid grid-cols-1 gap-3">
              <div className="grid grid-cols-3 gap-2 items-center">
                <dt className="text-sm text-gray-500">Nama</dt>
                <dd className="col-span-2 font-medium">{displayName}</dd>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="col-span-2">{user.email}</dd>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <dt className="text-sm text-gray-500">Headline</dt>
                <dd className="col-span-2">{headline}</dd>
              </div>
              <div className="pt-3">
                <a
                  href="/settings"
                  className="inline-flex px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
                >
                  Kelola Profil
                </a>
              </div>
            </dl>
          </section>

          {/* Keamanan */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold">Keamanan</h2>
            <p className="text-sm text-gray-500 mt-1">Atur kata sandi dan 2FA</p>
            <div className="space-y-3 mt-4">
              <a
                className="block w-full px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-left"
                href="/auth/change-password"
              >
                Ubah Kata Sandi
              </a>
              <a
                className="block w-full px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-left"
                href="/settings/security"
              >
                Aktifkan Authenticator (2FA)
              </a>
            </div>
          </section>
        </div>

        {/* Kanan */}
        <div className="lg:col-span-2 space-y-6">
          {/* Call to action */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  Belajar Apa Hari Ini??
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Cari kelas sesuai dengan minat anda
                </p>
              </div>
              <a
                href="/catalog"
                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
              >
                Jelajahi Kursus
              </a>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <p className="text-sm text-gray-500">Saatnya memulai!</p>
            </div>
          </section>

          {/* Sertifikat */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Sertifikat</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Unduh Sertifikat & Perbarui Portofolio Anda
                </p>
              </div>
              <a href="/sertifikat" className="text-sm underline">
                Lihat Semua
              </a>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-sm">
                  Belum ada sertifikat. Selesaikan kursus untuk mendapatkannya.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => {
                  const courseData = cert.courses || {};
                  return (
                    <div
                      key={cert.id}
                      className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200"
                    >
                      {/* Preview PDF */}
                      <div className="relative h-40 w-full bg-gray-100 overflow-hidden border-b border-gray-100">
                        {cert.pdf_url ? (
                          <>
                            <iframe
                              src={`${cert.pdf_url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                              className="w-full h-full border-0 pointer-events-none"
                              title={`Preview Sertifikat ${cert.code}`}
                              loading="lazy"
                              scrolling="no"
                            />
                            <div className="absolute inset-0 z-10 bg-transparent" />
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-600">
                            <Award className="w-12 h-12 mb-2 opacity-80" />
                            <span className="text-xs font-bold tracking-widest uppercase opacity-70">
                              Certificate
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3
                          className="font-semibold text-gray-900 line-clamp-2 mb-1 leading-snug min-h-[2.5rem]"
                          title={courseData.title}
                        >
                          {courseData.title || "Judul Kursus Tidak Ditemukan"}
                        </h3>
                        <p className="text-xs text-gray-500 mb-4 font-mono">
                          ID: {cert.code}
                        </p>
                        <div className="mt-auto pt-3 border-t border-gray-100">
                          {cert.pdf_url ? (
                            <a
                              href={cert.pdf_url}
                              target="_blank"
                              download={`Sertifikat-${cert.code}.pdf`}
                              className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                              <Download className="w-4 h-4" /> Unduh PDF
                            </a>
                          ) : (
                            <button
                              disabled
                              className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed"
                            >
                              Memproses...
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* PEMBAYARAN / RIWAYAT ENROLL */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold">Pembayaran</h2>
            <p className="text-sm text-gray-500 mt-1">
              Semua kursus yang sudah di-enroll (gratis & berbayar)
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-4">Invoice</th>
                    <th className="py-2 pr-4">Kursus</th>
                    <th className="py-2 pr-4">Jumlah</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((p) => {
                    const date = p.paid_at || p.created_at;
                    return (
                      <tr key={p.id} className="border-t">
                        <td className="py-2 pr-4 font-mono">{p.ref}</td>
                        <td className="py-2 pr-4">{p.course_title}</td>
                        <td className="py-2 pr-4">{formatIDR(p.amount)}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs ${
                              p.status === "settlement"
                                ? "bg-emerald-50 text-emerald-700"
                                : p.status === "pending"
                                ? "bg-amber-50 text-amber-700"
                                : p.status === "gratis"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4">
                          {date
                            ? new Date(date).toLocaleString("id-ID")
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                  {paymentHistory.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-3 text-sm text-gray-500"
                      >
                        Belum ada transaksi / enroll.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
