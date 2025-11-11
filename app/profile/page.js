// app/profile/page.js — server component (Next.js App Router)
// UI profil terhubung ke database Supabase menggunakan @supabase/ssr
// Catatan: sesuaikan nama tabel/kolom agar cocok dengan skema kamu.

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function formatIDR(n) {
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  } catch {
    return n;
  }
}

function ProgressBar({ value = 0 }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-emerald-400 to-lime-400" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}

async function getSupabaseServerClient() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Route handlers tidak mengizinkan set cookie; aman di page
          }
        },
      },
    }
  );
  return supabase;
}

export default async function ProfilePage() {
  const supabase = await getSupabaseServerClient();

  // 1) Auth user
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    redirect("/auth/sign-in");
  }

  // 2) Profile (opsi A: tabel `profiles`; opsi B: tabel `users`)
  //    Ganti nama tabel/kolom sesuai skema kamu.
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

  // 3) Enrollments + Courses (relasi course_id → courses)
  const { data: enrollments = [] } = await supabase
    .from("enrollments")
    .select(
      `id, progress, completed_modules, total_modules, updated_at, course_id,
       courses:course_id ( id, title, thumbnail )`
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  // 4) Certificates
  const { data: certificates = [] } = await supabase
    .from("certificates")
    .select("id, code, course_title, issued_at")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  // 5) Payments (sinkron dari Midtrans webhook)
  const { data: payments = [] } = await supabase
    .from("payments")
    .select("id, ref, course_title, amount, status, paid_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const displayName = profile?.full_name || user.user_metadata?.name || user.email?.split("@")[0];
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName || "User")}`;
  const headline = profile?.headline || "Belajar 10 menit per hari";

  const completedCount = (enrollments || []).filter((e) => (e?.progress ?? 0) >= 100).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-5">
        <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Profil</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full ring-4 ring-emerald-50" />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{displayName}</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
            <p className="text-gray-500 text-sm mt-1">{headline}</p>
          </div>
          <div className="flex gap-2">
            <a href="/learn" className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90">Lanjut Belajar</a>
            <a href="/auth/sign-in" className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">Keluar</a>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kiri */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold">Ringkasan Belajar</h2>
            <p className="text-sm text-gray-500 mt-1">Aktivitas dan progres singkat</p>
            <div className="grid grid-cols-3 gap-4 text-center mt-4">
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="text-2xl font-bold">{enrollments?.length ?? 0}</div>
                <div className="text-xs text-gray-600 mt-1">Kursus Diikuti</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="text-xs text-gray-600 mt-1">Selesai</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="text-2xl font-bold">{certificates?.length ?? 0}</div>
                <div className="text-xs text-gray-600 mt-1">Sertifikat</div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold">Info Akun</h2>
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
                <a href="/settings" className="inline-flex px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">Kelola Profil</a>
              </div>
            </dl>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold">Keamanan</h2>
            <p className="text-sm text-gray-500 mt-1">Atur kata sandi dan 2FA</p>
            <div className="space-y-3 mt-4">
              <a className="block w-full px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-left" href="/auth/change-password">Ubah Kata Sandi</a>
              <a className="block w-full px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-left" href="/settings/security">Aktifkan Authenticator (2FA)</a>
            </div>
          </section>
        </div>

        {/* Kanan */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Kursus Diikuti</h2>
                <p className="text-sm text-gray-500 mt-1">Lanjutkan dari modul terakhir</p>
              </div>
              <a href="/courses" className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm">Jelajah Kursus</a>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              {(enrollments || []).map((e) => (
                <article key={e.id} className="border border-gray-100 rounded-xl p-4 flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.courses?.thumbnail || 
                    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop"} alt="thumb" className="w-24 h-24 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold leading-snug">{e.courses?.title || "Tanpa Judul"}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {(e.completed_modules ?? 0)}/{(e.total_modules ?? 0)} modul · Aktivitas: {new Date(e.updated_at || Date.now()).toLocaleDateString("id-ID")}
                    </p>
                    <div className="mt-2"><ProgressBar value={e.progress ?? 0} /></div>
                    <div className="mt-3 flex gap-2">
                      <a href={`/learn/${e.course_id}`} className="px-3 py-1.5 rounded-lg bg-black text-white text-sm hover:opacity-90">Lanjutkan</a>
                      <a href={`/courses/${e.course_id}`} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">Detail</a>
                    </div>
                  </div>
                </article>
              ))}
              {(enrollments || []).length === 0 && (
                <p className="text-sm text-gray-500">Belum ada kursus diikuti.</p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Sertifikat</h2>
                <p className="text-sm text-gray-500 mt-1">Verifikasi publik & unduh PDF</p>
              </div>
              <a href="/dashboard" className="text-sm underline">Lihat Semua</a>
            </div>

            {(certificates || []).length === 0 ? (
              <p className="text-gray-500 text-sm mt-4">Belum ada sertifikat. Selesaikan kursus untuk mendapatkan sertifikat.</p>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2 pr-4">Kode</th>
                      <th className="py-2 pr-4">Kursus</th>
                      <th className="py-2 pr-4">Terbit</th>
                      <th className="py-2 pr-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(certificates || []).map((c) => (
                      <tr key={c.id} className="border-t">
                        <td className="py-2 pr-4 font-mono">{c.code}</td>
                        <td className="py-2 pr-4">{c.course_title}</td>
                        <td className="py-2 pr-4">{new Date(c.issued_at).toLocaleDateString("id-ID")}</td>
                        <td className="py-2 pr-4">
                          <a href={`/cert/${c.code}`} className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50">Verifikasi</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold">Pembayaran</h2>
            <p className="text-sm text-gray-500 mt-1">Riwayat transaksi Midtrans</p>
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
                  {(payments || []).map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="py-2 pr-4 font-mono">{p.ref}</td>
                      <td className="py-2 pr-4">{p.course_title}</td>
                      <td className="py-2 pr-4">{formatIDR(p.amount)}</td>
                      <td className="py-2 pr-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs ${p.status === "settlement" ? "bg-emerald-50 text-emerald-700" : p.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-700"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4">{p.paid_at ? new Date(p.paid_at).toLocaleString("id-ID") : "-"}</td>
                    </tr>
                  ))}
                  {(payments || []).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-3 text-sm text-gray-500">Belum ada transaksi.</td>
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
