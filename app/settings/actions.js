// app/settings/actions.js
"use server";

import { revalidatePath } from "next/cache";
import { createServerClientWritable } from "@/lib/supabase/server";

// Validasi sederhana (opsional, bisa ganti pakai zod)
function sanitize(s, max = 120) {
  if (!s) return "";
  return String(s).slice(0, max);
}

export async function updateProfile(formData) {
  const supabase = createServerClientWritable();

  // Pastikan user ada
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) {
    return { ok: false, error: "Tidak terautentikasi." };
  }
  const user = userData.user;

  const full_name = sanitize(formData.get("full_name"), 120);
  const headline  = sanitize(formData.get("headline"), 180);
  const file      = formData.get("avatar");

  let avatar_url = null;

  // Upload avatar jika ada file
  if (file && typeof file === "object" && "size" in file && file.size > 0) {
    const ext = (file.name?.split(".").pop() || "png").toLowerCase();
    const path = `${user.id}/${Date.now()}.${ext}`;

    // Pastikan bucket `avatars` sudah dibuat di Supabase Storage
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { cacheControl: "3600", upsert: true });
    if (upErr) {
      return { ok: false, error: "Gagal mengunggah avatar." };
    }

    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    avatar_url = pub?.publicUrl || null;
  }

  // Upsert ke tabel `profiles` (sesuaikan nama tabel/kolom jika beda)
  const updatePayload = {
    id: user.id,
    full_name,
    headline,
  };
  if (avatar_url) updatePayload.avatar_url = avatar_url;

  const { error: upsertErr } = await supabase
    .from("profiles")
    .upsert(updatePayload, { onConflict: "id" });

  if (upsertErr) {
    return { ok: false, error: "Gagal menyimpan profil." };
  }

  // optional: sinkron ke user metadata (kalau kamu pakai)
  // await supabase.auth.updateUser({ data: { name: full_name } });

  // Segarkan halaman profil & settings
  revalidatePath("/profile");
  revalidatePath("/settings");

  return { ok: true };
}
