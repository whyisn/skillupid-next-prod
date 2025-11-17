// app/api/quiz/submit/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req) {
  try {
    const { quiz_id, answers } = await req.json();

    if (!quiz_id || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "quiz_id dan answers wajib diisi" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json(
        { error: "Harus login dulu" },
        { status: 401 }
      );
    }

    const admin = supabaseAdmin();

    // Ambil semua soal + kunci jawaban untuk quiz/module ini
    const { data: questions, error: qErr } = await admin
      .from("questions")
      .select("id, answer_key")
      .eq("quiz_id", quiz_id)
      .order("id");

    if (qErr) {
      console.error("Quiz questions error:", qErr);
      return NextResponse.json(
        { error: "Gagal mengambil soal" },
        { status: 500 }
      );
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Soal untuk quiz ini belum tersedia" },
        { status: 404 }
      );
    }

    // Hitung skor
    let score = 0;
    questions.forEach((q, idx) => {
      const correct = q.answer_key;          // jsonb → otomatis diparse
      const userAnswer = answers[idx] ?? null;
      if (userAnswer !== null && userAnswer === correct) {
        score += 1;
      }
    });

    const passed = score >= 4; // requirement: minimal 4 benar

    // Simpan submission baru (boleh banyak attempt; yg penting ada yg passed)
    const { error: sErr } = await admin.from("submissions").insert({
      quiz_id,
      user_id: user.id,
      score,
      passed,
    });

    if (sErr) {
      console.error("Insert submission error:", sErr);
      return NextResponse.json(
        { error: "Gagal menyimpan hasil quiz" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { score, passed, total: questions.length },
      { status: 200 }
    );
  } catch (e) {
    console.error("Quiz submit error:", e);
    return NextResponse.json(
      { error: e.message || "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
