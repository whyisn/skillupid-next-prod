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

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", params.courseId)
    .maybeSingle();

  if (!enrollment) {
    redirect(`/courses/${params.courseId}`);
  }

  const { data: modules } = await supabase
    .from("modules")
    .select("id,title,order_no,video_provider,video_id,duration_seconds")
    .eq("course_id", params.courseId)
    .order("order_no");

  if (!modules || modules.length === 0) {
    return <div>Belum ada modul.</div>;
  }
  
  const moduleIds = modules.map(m => m.id);

  // --- 1. Fetch Initial Progress (untuk Client State) ---
  const { data: progressData } = await supabase
    .from("progress")
    .select("module_id, percent")
    .eq("enrollment_id", enrollment.id); 

  const initialProgress = progressData?.reduce((acc, p) => {
    acc[p.module_id] = p.percent;
    return acc;
  }, {}) || {};
  
  // --- 2. Logic Locking (Berdasarkan Kelulusan Quiz) ---
  
  const { data: submissions } = await supabase
    .from("submissions")
    .select("quiz_id, score")
    .eq("user_id", user.id)
    .in("quiz_id", moduleIds);

  const passedModuleIds = new Set();
  if (submissions) {
     submissions.forEach(s => {
        // Kelulusan Quiz: minimal 4 benar
        if (s.score >= 4) passedModuleIds.add(s.quiz_id);
     });
  }

  const lockedModuleIds = [];
  modules.forEach((mod, index) => {
    if (index === 0) return;
    const prevMod = modules[index - 1];
    // Modul terkunci jika quiz modul sebelumnya BELUM LULUS
    if (!passedModuleIds.has(prevMod.id)) {
      lockedModuleIds.push(mod.id);
    }
  });


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
      initialProgress={initialProgress} // Kirim progress awal
    />
  );
}