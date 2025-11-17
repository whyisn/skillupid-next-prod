import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();
  // 1. Ambil data user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  // 2. Ambil data profil
  let profile = null;
  const { data: profA } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();
  if (profA) profile = profA;
  if (!profile) {
    const { data: profB } = await supabase
      .from("users") 
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    if (profB) profile = profB;
  }
   // 3. Tentukan nama
  const displayName = profile?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";

  // 4. Kirim 'displayName' ke client, BUKAN 'userEmail'
  return <DashboardClient userDisplayName={displayName} />;
}