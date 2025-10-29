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

  // pastikan enroll
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

  const activeId = searchParams?.m || modules?.[0]?.id || null;

  return (
    <LearnClient
      enrollmentId={enrollment.id}
      courseId={params.courseId}
      modules={modules || []}
      activeModuleId={activeId}
    />
  );
}
