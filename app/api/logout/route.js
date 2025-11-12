// app/api/logout/route.js
import { NextResponse } from "next/server";
import { createServerClientWritable } from "@/lib/supabase/server";

export async function POST(req) {
  const supabase = createServerClientWritable();
  await supabase.auth.signOut(); // ini menulis cookie (diizinkan di route)
  return NextResponse.redirect(new URL("/auth/sign-in", req.url), { status: 302 });
}
