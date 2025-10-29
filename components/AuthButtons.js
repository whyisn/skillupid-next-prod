"use client";
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
    <div className="flex items-center gap-3">
      <a
        href="/auth/sign-in"
        className="px-4 py-2 rounded-xl border border-borderLight text-textMain hover:bg-gray-50 hover:shadow-sm"
      >
        Masuk
      </a>
      <button
        onClick={signOut}
        className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-blue-700 shadow-sm"
      >
        Keluar
      </button>
    </div>
  );
}
