// // app/courses/[id]/EnrollActions.js
// "use client";

// import { useState } from "react";

// export default function EnrollActions({ course }) {
//   const [loading, setLoading] = useState(false);

//   const enrollFree = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/enroll", {
//         method: "POST",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({ course_id: course.id }),
//         credentials: "include",
//       });
//     //   if (!res.ok) throw new Error("Gagal enroll course.");
//     if (!res.ok) {
//         const j = await res.json().catch(() => ({}));
//         throw new Error(j?.error || "Gagal enroll.");
//       }
//       window.location.href = `/learn/${course.id}`;
//     } catch (e) {
//       alert(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkout = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/checkout", {
//         method: "POST",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({ course_id: course.id }),
//       });
//       const data = await res.json();
//       if (data?.snapToken) {
//         // eslint-disable-next-line no-undef
//         window.snap?.pay(data.snapToken, {
//           onSuccess: () => (window.location.href = "/dashboard"),
//           onPending: () => (window.location.href = "/dashboard"),
//           onError: () => alert("Pembayaran gagal"),
//           onClose: () => {},
//         });
//       } else {
//         // fallback: redirect ke dashboard
//         window.location.href = "/dashboard";
//       }
//     } catch (e) {
//       alert(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!course.premium) {
//     return (
//       <button onClick={enrollFree} disabled={loading} className="px-5 py-3 rounded-xl bg-black text-white">
//         {loading ? "Memproses…" : "Mulai Gratis"}
//       </button>
//     );
//   }

//   return (
//     <button onClick={checkout} disabled={loading} className="px-5 py-3 rounded-xl bg-black text-white">
//       {loading ? "Memproses…" : `Beli Sekarang ${Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(course.price || 0)}`}
//     </button>
//   );
// }

// app/courses/[id]/EnrollActions.js
"use client";

import { useState } from "react";

export default function EnrollActions({ course }) {
  const [loading, setLoading] = useState(false);

  const enrollFree = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ course_id: course.id }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar kursus");

      // Redirect ke halaman belajar
      window.location.href = `/learn/${course.id}`;
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ course_id: course.id }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat transaksi");

      // Redirect ke halaman pembayaran Midtrans (Snap Redirect)
      window.location.href = data.redirect_url;
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

  // Kursus gratis
  if (!course.premium) {
    return (
      <button
        onClick={enrollFree}
        disabled={loading}
        className="px-5 py-3 rounded-xl bg-black text-white"
      >
        {loading ? "Memproses…" : "Mulai Gratis"}
      </button>
    );
  }

  // Kursus premium
  return (
    <button
      onClick={checkout}
      disabled={loading}
      className="px-5 py-3 rounded-xl bg-black text-white"
    >
      {loading ? "Memproses…" : `Beli Sekarang ${formatRupiah(course.price)}`}
    </button>
  );
}
