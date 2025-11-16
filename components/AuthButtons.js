// components/AuthButtons.js
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import UserDropdown from "./UserDropdown"; // <-- Impor Client Component

export default async function AuthButtons() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika user belum login
  if (!user) {
    return (
      <Link
        href="/auth/sign-in"
        className="px-3 py-1 rounded bg-black text-white hover:bg-gray-900"
      >
        Masuk
      </Link>
    );
  }

  // --- LOGIKA DISALIN DARI profile/page.js ---
  
  // 2) Profile (opsi A: `profiles`; fallback ke `users`)
  let profile = null;
  const { data: profA } = await supabase
    .from("profiles")
    .select("id, full_name, headline, avatar_url") // Ambil field yang sama
    .eq("id", user.id)
    .maybeSingle();

  if (profA) profile = profA;
  
  // Jika di 'profiles' tidak ada, cari di 'users' (fallback)
  if (!profile) {
    const { data: profB } = await supabase
      .from("users") 
      .select("id, full_name, headline, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    if (profB) profile = profB;
  }

  // Tentukan displayName dan avatarUrl persis seperti di profile/page.js
  const displayName = profile?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName || "User")}`;
  
  // --- Selesai Logika Salinan ---

  // Kirim data profile ke Client Component
  return <UserDropdown displayName={displayName} avatarUrl={avatarUrl} />;
}