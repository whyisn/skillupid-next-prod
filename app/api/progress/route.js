// app/api/progress/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const { enrollment_id, module_id, percent } = await req.json();

    if (!enrollment_id || !module_id || percent === undefined) {
      return NextResponse.json(
        { error: "Data progress (enrollment_id, module_id, percent) wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Upsert (Update or Insert) data ke tabel progress
    const { data, error } = await supabase
      .from("progress")
      .upsert(
        { 
          enrollment_id, 
          module_id, 
          percent: Math.min(100, Math.max(0, percent)), 
          updated_at: new Date().toISOString()
        },
        { 
          onConflict: "enrollment_id,module_id" 
        }
      )
      .select("id")
      .single();

    if (error) {
      console.error("Progress upsert error:", error.message);
      return NextResponse.json({ error: error.message || "Gagal menyimpan progress." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id }, { status: 200 });

  } catch (e) {
    return NextResponse.json({ error: e.message || "Kesalahan server tak terduga." }, { status: 500 });
  }
}