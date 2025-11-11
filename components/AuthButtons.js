"use client";
// components/AuthButtons.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

export function AuthButtons() {
  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  return (
    <div className="flex items-center gap-2">
      <a href="/auth/sign-in" className="px-3 py-1 rounded bg-black text-white hover:bg-gray-900">Masuk</a>
      {/*<button onClick={signOut} className="px-3 py-1 rounded bg-black text-white hover:bg-gray-900">Keluar</button>*/}
    </div>
  );
}
