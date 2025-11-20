// app/auth/change-password/page.js
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChangePasswordClient from "./ChangePasswordClient";

export default async function ChangePasswordPage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = error ? null : data?.user ?? null;

  if (!user) {
    redirect("/auth/sign-in?redirect=/auth/change-password");
  }

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Ubah Kata Sandi</h1>
      <p className="text-sm text-gray-600 mb-6">
        Masukkan kata sandi baru untuk akunmu.
      </p>
      <ChangePasswordClient />
    </main>
  );
}
