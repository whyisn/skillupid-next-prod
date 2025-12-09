"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";

export default function EnrollActions({ course }) {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const router = useRouter();

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ course_id: course.id }),
        credentials: "include",
      });

      // [LOGIKA BARU] Cek apakah user belum login (401)
      if (res.status === 401) {
        // Arahkan ke halaman login dengan membawa url tujuan (redirect)
        // encodeURIComponent digunakan agar URL aman
        const redirectUrl = encodeURIComponent(`/courses/${course.id}`);
        router.push(`/auth/sign-in?redirect=${redirectUrl}`);
        return; // Hentikan eksekusi agar tidak lanjut ke alert error
      }
    
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Gagal enroll.");
      }

      router.push('/dashboard'); 

    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ course_id: course.id }),
      });

      // [OPSIONAL] Logika yang sama juga sebaiknya diterapkan di checkout
      if (res.status === 401) {
        const redirectUrl = encodeURIComponent(`/courses/${course.id}`);
        router.push(`/auth/sign-in?redirect=${redirectUrl}`);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Checkout gagal");
      }

      if (data?.token) {
        // eslint-disable-next-line no-undef
        window.snap?.pay(data.token, {
          onSuccess: () => (window.location.href = "/dashboard"),
          onPending: () => (window.location.href = "/dashboard"),
          onError: () => alert("Pembayaran gagal"),
          onClose: () => {},
        });
      } else if (data?.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        window.location.href = "/dashboard";
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  // --- Render ---

  if (!course.premium) {
    return (
      <Fragment>
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={loading}
          className="w-full px-5 py-3 rounded-xl bg-[#1ABC9C] text-white hover:bg-[#16a085] transition-colors"
        >
          {loading ? "Memproses…" : "Enroll"}
        </button>

        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Ingin belajar sekarang?
              </h3>
              <p className="text-gray-600 mt-2">
                Kursus ini akan ditambahkan ke dashboard Anda untuk dipelajari kapan saja.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Tidak
                </button>
                <button
                  onClick={handleEnroll}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-[#1ABC9C] text-white hover:bg-[#16a085] transition-colors"
                >
                  {loading ? "Memproses..." : "Ya"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }

  return (
    <button
      onClick={checkout}
      disabled={loading}
      className="w-full px-5 py-3 rounded-xl bg-[#1ABC9C] text-white hover:bg-[#16a085] transition-colors"
    >
      {loading ? "Memproses…" : `Beli Sekarang ${formatRupiah(course.price)}`}
    </button>
  );
}