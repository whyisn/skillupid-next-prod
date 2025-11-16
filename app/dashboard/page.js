// app/dashboard/page.js

// === [PERBAIKAN DI SINI] ===
// Baris ini memaksa Next.js untuk selalu me-render halaman ini di server
// setiap kali diminta (sama seperti getServerSideProps).
export const dynamic = 'force-dynamic';
// ==========================

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();

  // 1. Ambil data user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  // 2. Ambil data profil
  let profile = null;
  const { data: profA } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profA) profile = profA;

  if (!profile) {
    const { data: profB } = await supabase
      .from("users") 
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    if (profB) profile = profB;
  }

  const displayName = profile?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";

  // 3. Ambil data kursus yang di-enroll user
  // Query ini sekarang akan dijamin selalu mengambil data terbaru
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      progress_percent, 
      courses ( id, title, thumbnail_url )
    `)
    .eq("user_id", user.id);

  // 4. Kirim 'displayName' DAN 'enrollments' ke client
  return (
    <DashboardClient 
      userDisplayName={displayName} 
      initialEnrollments={enrollments || []}
    />
  );
}