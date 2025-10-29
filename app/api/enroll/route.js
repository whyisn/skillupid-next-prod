// app/api/enroll/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const { course_id } = await req.json();
    if (!course_id) {
      return NextResponse.json({ error: "course_id wajib ada" }, { status: 400 });
    }

    // const supabase = createClient();
    // createClient() sekarang sudah membaca/mengelola cookie sesi
    const supabase = createClient();

    // Ambil user dari cookie Supabase
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) {
    //   return NextResponse.json({ error: userErr.message }, { status: 401 });
    return NextResponse.json({ error: userErr.message || "Auth session missing!" }, { status: 401 });
    }
    if (!user) {
    //   return NextResponse.json({ error: "Belum login" }, { status: 401 });
    return NextResponse.json({ error: "Auth session missing!" }, { status: 401 });
    }

    // Upsert enrollment (unik di (user_id, course_id))
    const { data, error } = await supabase
      .from("enrollments")
      .upsert(
        { user_id: user.id, course_id, status: "active" },
        { onConflict: "user_id,course_id" }
      )
      .select("id")
      .single();

    if (error) {
      // kirimkan pesan error yang berguna (mis. RLS blocked)
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, enrollment_id: data.id }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
