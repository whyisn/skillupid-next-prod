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

  // 1. Cek Enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", params.courseId)
    .maybeSingle();

  if (!enrollment) {
    redirect(`/courses/${params.courseId}`);
  }

  // Fetch Course Data (untuk Judul Sertifikat)
  const { data: course } = await supabase
    .from("courses")
    .select("title")
    .eq("id", params.courseId)
    .maybeSingle();

  // 2. Ambil Modul
  const { data: modules } = await supabase
    .from("modules")
    .select("id,title,order_no,video_provider,video_id,duration_seconds")
    .eq("course_id", params.courseId)
    .order("order_no");

  if (!modules || modules.length === 0) {
    return <div>Belum ada modul.</div>;
  }
  
  const moduleIds = modules.map(m => m.id);

  // --- 3. Fetch Progress & Submissions ---
  
  // A. Fetch Video Progress (percent)
  const { data: progressData } = await supabase
    .from("progress")
    .select("module_id, percent")
    .eq("enrollment_id", enrollment.id); 

  const initialProgress = progressData?.reduce((acc, p) => {
    acc[p.module_id] = p.percent;
    return acc;
  }, {}) || {};
  
  // B. Fetch Quiz Submissions (score)
  const { data: submissions } = await supabase
    .from("submissions")
    .select("quiz_id, score")
    .eq("user_id", user.id)
    .in("quiz_id", moduleIds);


  // --- 4. Tentukan Status Selesai (CompletedModuleIds) & Locking ---
  
  const completedModuleIds = new Set();
  
  // 4a. Buat map status kuis (Lulus jika Score >= 4)
  const quizPassedMap = submissions?.reduce((acc, s) => {
      if (s.score >= 4) {
          acc[s.quiz_id] = true;
      }
      return acc;
  }, {}) || {};

  // 4b. Gabungkan Video (>= 80%) DAN Kuis Lulus
  modules.forEach(mod => {
      const isQuizPassed = quizPassedMap[mod.id] === true;
      const isVideoComplete = (initialProgress[mod.id] || 0) >= 80; // Cek Video 80%

      if (isQuizPassed && isVideoComplete) {
          completedModuleIds.add(mod.id);
      }
  });

  // [BARU] Cek apakah SEMUA modul sudah selesai
  const courseFullyComplete = modules.length > 0 && completedModuleIds.size === modules.length;

  // 4c. Tentukan daftar ID modul yang terkunci
  const lockedModuleIds = [];
  modules.forEach((mod, index) => {
    if (index === 0) return; // Modul pertama selalu terbuka
    const prevMod = modules[index - 1];
    
    if (!completedModuleIds.has(prevMod.id)) {
      lockedModuleIds.push(mod.id);
    }
  });

  // Ambil Nama User untuk Sertifikat (Fallback ke email)
  const userName = user.user_metadata?.name || user.email?.split("@")[0] || 'Student';


  let activeId = searchParams?.m || modules[0].id;
  if (lockedModuleIds.includes(activeId)) {
    activeId = modules[0].id;
  }

  return (
    <LearnClient
      enrollmentId={enrollment.id}
      courseId={params.courseId}
      modules={modules || []}
      activeModuleId={activeId}
      lockedModuleIds={lockedModuleIds}
      initialProgress={initialProgress}
      
      // NEW PROPS FOR CERTIFICATE
      user_id={user.id}
      userName={userName}
      courseTitle={course?.title || 'Course'}
      courseFullyComplete={courseFullyComplete} // Kirim status kelulusan total
    />
  );
}