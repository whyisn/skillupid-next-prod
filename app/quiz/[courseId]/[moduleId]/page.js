// app/quiz/[courseId]/[moduleId]/page.js
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import QuizClient from "./QuizClient";

export default async function QuizPage({ params }) {
  const { courseId, moduleId } = params;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectTo = `/quiz/${courseId}/${moduleId}`;

  if (!user) {
    redirect(`/auth/sign-in?redirect=${encodeURIComponent(redirectTo)}`);
  }

  // Pastikan user sudah enroll di course ini
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  const admin = supabaseAdmin();

  // Ambil info quiz (id = moduleId)
  const { data: quiz } = await admin
    .from("quizzes")
    .select("id, title")
    .eq("id", moduleId)
    .maybeSingle();

  // Ambil 5 soal untuk quiz/module ini
  const { data: questions } = await admin
    .from("questions")
    .select("id, body, options")
    .eq("quiz_id", moduleId)
    .order("id");

  const safeQuestions = (questions || []).map((q) => ({
    id: q.id,
    body: q.body,
    options: Array.isArray(q.options) ? q.options : q.options ?? [],
  }));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <QuizClient
        courseId={courseId}
        moduleId={moduleId}
        quizTitle={quiz?.title || "Kuis Modul"}
        questions={safeQuestions}
      />
    </div>
  );
}
