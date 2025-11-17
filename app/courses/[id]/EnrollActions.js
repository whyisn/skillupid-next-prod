// app/courses/[id]/EnrollActions.js
"use client";

// [PERUBAHAN] 'Fragment' ditambahkan untuk me-return modal dan tombol
import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";

export default function EnrollActions({ course }) {
  const [loading, setLoading] = useState(false);
  // [TAMBAHAN] State untuk menampilkan/menyembunyikan modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const router = useRouter();

  // [PERUBAHAN] Nama fungsi diubah menjadi 'handleEnroll'
  // Logika window.confirm() dihapus karena sudah ditangani modal
  const handleEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ course_id: course.id }),
        credentials: "include",
      });
    
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Gagal enroll.");
      }

      router.push('/dashboard'); 

    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
      // [TAMBAHAN] Selalu tutup modal setelah aksi selesai
      setShowConfirmModal(false);
    }
  };

  // Fungsi checkout (logika tidak berubah)
  // const checkout = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/checkout", {
  //       method: "POST",
  //       headers: { "content-type": "application/json" },
  //       body: JSON.stringify({ course_id: course.id }),
  //     });
  //     const data = await res.json();
  //     if (data?.snapToken) {
  //       // eslint-disable-next-line no-undef
  //       window.snap?.pay(data.snapToken, {
  //         onSuccess: () => (window.location.href = "/dashboard"),
  //         onPending: () => (window.location.href = "/dashboard"),
  //         onError: () => alert("Pembayaran gagal"),
  //         onClose: () => {},
  //       });
  //     } else {
  //       window.location.href = "/dashboard";
  //     }
  //   } catch (e) {
  //     alert(e.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const checkout = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ course_id: course.id }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Checkout gagal");

    // BACKEND mengirim { token, redirect_url }
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

  // [TAMBAHAN] Helper 'formatRupiah' dibutuhkan untuk tombol premium
  // (Anda bisa menghapus ini jika Anda mengimpornya dari file lain)
  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  // --- Render ---

  // [PERUBAHAN] Kursus gratis (sesuai kode Anda)
  if (!course.premium) {
    return (
      <Fragment>
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={loading}
          className="w-full px-5 py-3 rounded-xl bg-[#1ABC9C] text-white hover:bg-[#16a085] transition-colors"
        >
          {loading ? "Memproses…" : "Mulai Gratis"}
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

  // [PERUBAHAN] Kursus premium (sesuai kode Anda)
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