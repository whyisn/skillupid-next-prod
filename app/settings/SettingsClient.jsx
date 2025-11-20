// app/settings/SettingsClient.jsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation"; 
import { updateProfile } from "./actions";
import toast, { Toaster } from "react-hot-toast"; 

export default function SettingsClient({ initial }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initial.full_name);
  const [headline, setHeadline] = useState(initial.headline);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.set("full_name", fullName);
    formData.set("headline", headline);
    if (avatarFile) formData.set("avatar", avatarFile);

    // ID Unik agar notifikasi tidak menumpuk (stacking)
    const TOAST_ID = "profile_save";

    // Opsional: Munculkan loading dulu (menggantikan notifikasi sebelumnya)
    toast.loading("Menyimpan perubahan...", {
      id: TOAST_ID,
      style: {
        borderRadius: "12px",
        padding: "16px",
        background: "#333",
        color: "#fff",
      }
    });

    startTransition(async () => {
      const res = await updateProfile(formData);

      if (res?.ok) {
        // ✅ SUKSES: Update notifikasi loading menjadi sukses (ID SAMA)
        toast.success("Profil berhasil diperbarui!", {
          id: TOAST_ID, // ⬅️ KUNCI AGAR TIDAK MENUMPUK
          duration: 3000,
          position: "top-center",
          style: {
            background: "#10B981", // Emerald
            color: "#fff",
            borderRadius: "12px",
            fontWeight: "500",
            padding: "16px",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10B981",
          },
        });

        setTimeout(() => {
          router.push("/profile");
          router.refresh();
        }, 1500);

      } else {
        // ❌ GAGAL: Update notifikasi loading menjadi error (ID SAMA)
        toast.error(res?.error || "Gagal menyimpan profil.", {
          id: TOAST_ID, // ⬅️ KUNCI AGAR TIDAK MENUMPUK
          duration: 4000,
          position: "top-center",
          style: {
            background: "#EF4444", // Red
            color: "#fff",
            borderRadius: "12px",
            fontWeight: "500",
            padding: "16px",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#EF4444",
          },
        });
      }
    });
  }

  return (
    <>
      <Toaster />

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            disabled
            defaultValue={initial.email}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Nama Lengkap</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            placeholder="Nama lengkap"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Headline</label>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            placeholder="Mis. Belajar 10 menit per hari"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Avatar (opsional)</label>
          <div className="mt-1 flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">PNG/JPG maksimal ~2MB.</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <a
            href="/profile"
            className="px-6 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            Batal
          </a>
        </div>
      </form>
    </>
  );
}