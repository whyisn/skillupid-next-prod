// app/api/quiz/status/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const quiz_id = searchParams.get("quiz_id");

    if (!quiz_id) {
      return NextResponse.json(
        { error: "quiz_id wajib diisi" },
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

    const { data, error } = await supabase
      .from("submissions")
      .select("score, passed")
      .eq("quiz_id", quiz_id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Quiz status error:", error);
      return NextResponse.json(
        { error: "Gagal mengambil status quiz" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        score: data?.score ?? 0,
        passed: data?.passed ?? false,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Quiz status exception:", e);
    return NextResponse.json(
      { error: e.message || "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
