// components/UserDropdown.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Gunakan Next/Image untuk optimasi

// --- Mengimpor ikon dari library LUCIDE ---
import {
  Home,
  LogOut,
  ChevronDown,
} from "lucide-react"; // <-- Impor dari lucide-react

export default function UserDropdown({ displayName, avatarUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Ambil nama depan saja untuk sapaan
  const firstName = displayName.split(" ")[0];

  return (
    <div className="relative">
      {/* Tombol Trigger (Hai, Alvin) */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 font-medium text-sm text-gray-700 hover:text-black"
      >
        <span>Hai, {firstName}</span>
        
        {/* --- Mengganti dengan Ikon Lucide --- */}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          strokeWidth={2.5} // <-- Lucide sering terlihat lebih baik dengan stroke lebih tebal
        />
      </button>

      {/* Konten Dropdown Sesuai Gambar 1 */}
      {isOpen && (
        <div className="absolute bg-white border border-gray-100 shadow-xl mt-2 right-0 rounded-xl w-60 z-50 overflow-hidden">
          {/* 1. Header Profil */}
          <div className="p-4 flex items-center gap-3">
            <Image
              src={avatarUrl}
              alt="avatar"
              width={48}
              height={48}
              className="rounded-full w-12 h-12 object-cover"
            />
            <div>
              <div className="font-bold text-lg text-gray-900">
                {displayName}
              </div>
            </div>
          </div>

          {/* 2. View Profile Link (Bukan Button) */}
          <div className="px-4 pb-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)} // Tutup dropdown saat diklik
              className="block w-full text-center px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium"
            >
              View Profile
            </Link>
          </div>

          <hr className="mx-4 my-1 border-gray-100" />

          {/* 3. Menu Navigasi */}
          <nav className="p-2 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700"
            >
              {/* --- Mengganti dengan Ikon Lucide --- */}
              <Home className="w-5 h-5 text-gray-500" />
              <span>Dashboard</span>
            </Link>
          </nav>

          <hr className="mx-4 my-1 border-gray-100" />

          {/* 4. Logout Button */}
          <div className="p-2">
            <form action="/auth/sign-out" method="post" className="w-full">
              <button
                type="submit"
                className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-red-600 group"
              >
                {/* --- Mengganti dengan Ikon Lucide --- */}
                <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}