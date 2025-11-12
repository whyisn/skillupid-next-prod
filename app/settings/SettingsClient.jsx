// app/settings/SettingsClient.jsx
"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "./actions";

export default function SettingsClient({ initial }) {
  const [fullName, setFullName] = useState(initial.full_name);
  const [headline, setHeadline] = useState(initial.headline);
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(e) {
    e.preventDefault();
    setMessage("");
    const formData = new FormData();
    formData.set("full_name", fullName);
    formData.set("headline", headline);
    if (avatarFile) formData.set("avatar", avatarFile);

    startTransition(async () => {
      const res = await updateProfile(formData);
      setMessage(res?.ok ? "Profil berhasil disimpan." : (res?.error || "Gagal menyimpan profil."));
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input disabled defaultValue={initial.email} className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-gray-600" />
      </div>

      <div>
        <label className="block text-sm font-medium">Nama Lengkap</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Nama lengkap"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Headline</label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Mis. Belajar 10 menit per hari"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Avatar (opsional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">PNG/JPG maksimal ~2MB.</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 disabled:opacity-70"
        >
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <a href="/profile" className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">Batal</a>
      </div>

      {message && (
        <div className="text-sm mt-2">{message}</div>
      )}
    </form>
  );
}
