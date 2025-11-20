"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function ChangePasswordClient() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (password.length < 8) {
      setMsg("Minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setMsg("Konfirmasi tidak sama.");
      return;
    }

    setLoading(true);
    const { error } = await supabaseBrowser.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMsg(error.message || "Gagal mengubah kata sandi.");
      return;
    }

    setMsg("Kata sandi berhasil diubah.");
    setPassword("");
    setConfirm("");
    // opsional: kembali ke dashboard / profile
    setTimeout(() => router.replace("/profile"), 1200);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Kata sandi baru</label>
        <input
          type="password"
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Konfirmasi kata sandi</label>
        <input
          type="password"
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      {msg && <p className="text-sm text-red-500">{msg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-black text-white py-2 text-sm disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : "Simpan Kata Sandi"}
      </button>
    </form>
  );
}
