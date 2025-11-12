// app/settings/page.js
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = createClient(); // read-only (aman di RSC)
  let user = null;

  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) user = data?.user ?? null;
  } catch {
    user = null;
  }
  if (!user) redirect("/auth/sign-in?redirect=/settings");

  // ambil profil awal
  const { data: prof } = await supabase
    .from("profiles")
    .select("id, full_name, headline, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const initial = {
    full_name: prof?.full_name || user.user_metadata?.name || "",
    headline: prof?.headline || "",
    avatar_url: prof?.avatar_url || "",
    email: user.email,
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Kelola Profil</h1>
      <p className="text-gray-600 mt-2">
        Perbarui nama, headline, dan foto profilmu.
      </p>

      <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
        <SettingsClient initial={initial} />
      </div>
    </main>
  );
}
