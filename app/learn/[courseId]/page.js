// app/learn/[courseId]/page.js
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LearnClient from "./LearnClient";

export default async function LearnPage({ params, searchParams }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?redirect=${encodeURIComponent(`/learn/${params.courseId}`)}`);
  }

  // 1. Pastikan enroll
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", params.courseId)
    .maybeSingle();

  if (!enrollment) {
    redirect(`/courses/${params.courseId}`);
  }

  // 2. Ambil semua modul
  const { data: modules } = await supabase
    .from("modules")
    .select("id,title,order_no,video_provider,video_id,duration_seconds")
    .eq("course_id", params.courseId)
    .order("order_no");

  if (!modules || modules.length === 0) {
    return <div>Belum ada modul.</div>;
  }

  // --- LOGIKA GEMBOK (LOCKING) ---
  
  // 3. Ambil daftar quiz yang SUDAH LULUS (passed = true) oleh user ini
  const { data: passedSubmissions } = await supabase
    .from("submissions")
    .select("quiz_id")
    .eq("user_id", user.id)
    .eq("passed", true);

  // Buat Set ID modul yang sudah lulus supaya gampang dicek
  const passedModuleIds = new Set(passedSubmissions?.map((s) => s.quiz_id) || []);

  // 4. Tentukan mana modul yang TERKUNCI
  // Aturan: Modul ke-N terbuka jika Modul ke-(N-1) sudah ada di passedModuleIds.
  // Modul pertama (index 0) SELALU terbuka.
  
  const lockedModuleIds = [];

  modules.forEach((mod, index) => {
    if (index === 0) {
      // Modul pertama selalu terbuka
      return;
    }
    
    // Cek modul sebelumnya
    const prevMod = modules[index - 1];
    
    // Jika modul sebelumnya BELUM lulus, maka modul ini (dan seterusnya) TERKUNCI
    if (!passedModuleIds.has(prevMod.id)) {
      lockedModuleIds.push(mod.id);
    }
  });

  // -------------------------------

  // Tentukan active module (default ke modul pertama jika tidak ada param)
  let activeId = searchParams?.m || modules[0].id;

  // Security: Jika user mencoba akses modul terkunci via URL, paksa pindah ke modul pertama
  if (lockedModuleIds.includes(activeId)) {
    activeId = modules[0].id;
  }

  return (
    <LearnClient
      enrollmentId={enrollment.id}
      courseId={params.courseId}
      modules={modules || []}
      activeModuleId={activeId}
      lockedModuleIds={lockedModuleIds} // <-- Kirim data lock ke client
    />
  );
}