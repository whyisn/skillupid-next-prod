import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req) {
  try {
    const { module_id, answers } = await req.json();

    if (!module_id || !answers) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const supabase = createClient();

    // Ambil user dari session
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Harus login" }, { status: 401 });
    }

    // Ambil soal quiz modul
    const admin = supabaseAdmin();
    const { data: questions } = await admin
      .from("quizzes")
      .select("id, answer")
      .eq("module_id", module_id);

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "Quiz tidak ditemukan" }, { status: 404 });
    }

    // Hitung skor
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });

    const passed = score >= 4;

    // Simpan hasil quiz
    await admin
      .from("quiz_results")
      .upsert(
        {
          user_id: user.id,
          module_id,
          score,
          passed,
        },
        { onConflict: "user_id,module_id" }
      );

    return NextResponse.json({ score, passed }, { status: 200 });

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
