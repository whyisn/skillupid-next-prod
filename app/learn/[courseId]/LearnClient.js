// // app/learn/[courseId]/LearnClient.js
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import ModuleSidebar from "@/components/ModuleSidebar";
// import SignedMuxPlayer from "@/components/SignedMuxPlayer";
// import ProgressBar from "@/components/ProgressBar";

// export default function LearnClient({ enrollmentId, courseId, modules, activeModuleId }) {
//   const [currentId, setCurrentId] = useState(activeModuleId);
//   const [progress, setProgress] = useState({}); // { moduleId: percent }

//   const active = useMemo(() => modules.find(m => m.id === currentId) || modules[0], [modules, currentId]);

//   useEffect(() => { setCurrentId(activeModuleId); }, [activeModuleId]);

//   // Simulasi: tandai progress selesai saat video diputar 5 detik (ganti dengan callback player ended)
//   const handleCompleted = async () => {
//     setProgress(p => ({ ...p, [active.id]: 100 }));
//     // upsert progress ke API kamu
//     fetch("/api/progress", {
//       method: "POST",
//       headers: { "content-type": "application/json" },
//       body: JSON.stringify({ enrollment_id: enrollmentId, module_id: active.id, percent: 100 }),
//     });
//   };

//   const nextModule = () => {
//     const idx = modules.findIndex(m => m.id === active.id);
//     const next = modules[idx + 1];
//     if (next) setCurrentId(next.id);
//   };

//   const overall = Math.round(
//     (modules.length === 0 ? 0 : (modules.reduce((acc, m) => acc + (progress[m.id] || 0), 0) / (modules.length * 100)) * 100)
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-6">
//       <aside className="col-span-12 md:col-span-4 lg:col-span-3">
//         <ModuleSidebar
//           modules={modules}
//           activeId={active?.id}
//           progress={progress}
//           onSelect={(id) => setCurrentId(id)}
//         />
//       </aside>

//       <section className="col-span-12 md:col-span-8 lg:col-span-9">
//         {active?.video_provider === "mux" && active?.video_id ? (
//           <SignedMuxPlayer playbackId={active.video_id} onCompleted={handleCompleted} />
//         ) : (
//           <div className="aspect-video rounded-xl bg-gray-100 grid place-items-center text-gray-500">
//             Video belum tersedia
//           </div>
//         )}

//         <h1 className="text-xl font-bold mt-4">{active?.title}</h1>
//         <div className="mt-4">
//           <ProgressBar value={overall} />
//         </div>

//         <div className="mt-4 flex gap-2">
//           <a href={`/quiz/${courseId}/${active?.id}`} className="px-4 py-2 rounded-xl border">Kuis Modul</a>
//           <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={nextModule}>Modul Berikutnya</button>
//         </div>
//       </section>
//     </div>
//   );
// }

// app/learn/[courseId]/LearnClient.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ModuleSidebar from "@/components/ModuleSidebar";
import SignedMuxPlayer from "@/components/SignedMuxPlayer";
import ProgressBar from "@/components/ProgressBar";

export default function LearnClient({
  enrollmentId,
  courseId,
  modules,
  activeModuleId,
}) {
  const router = useRouter();
  const [currentId, setCurrentId] = useState(activeModuleId);
  const [progress, setProgress] = useState({}); // { moduleId: percent }
  const [checkingNext, setCheckingNext] = useState(false);

  // modul aktif
  const active = useMemo(
    () => modules.find((m) => m.id === currentId) || modules[0],
    [modules, currentId]
  );

  // jika server mengganti activeModuleId (mis: via query m=)
  useEffect(() => {
    setCurrentId(activeModuleId);
  }, [activeModuleId]);

  // progress keseluruhan (rata-rata)
  const overall = useMemo(() => {
    if (!modules || modules.length === 0) return 0;
    const total = modules.reduce(
      (sum, m) => sum + (progress[m.id] || 0),
      0
    );
    return Math.round(total / modules.length);
  }, [modules, progress]);

  const handleModuleSelect = (moduleId) => {
    setCurrentId(moduleId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("m", moduleId);
      router.push(url.pathname + "?" + url.searchParams.toString());
    }
  };

  const handleVideoCompleted = () => {
    if (!active) return;
    setProgress((prev) => ({
      ...prev,
      [active.id]: 100,
    }));
    // kalau mau: kirim ke backend progress table di sini (optional)
  };

  // cek ke backend apakah kuis modul aktif sudah lulus (>=4)
  const checkQuizPassed = async (quizId) => {
    const res = await fetch(
      `/api/quiz/status?quiz_id=${encodeURIComponent(quizId)}`
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Gagal mengecek status kuis");
    }
    return data?.passed === true;
  };

  const nextModule = async () => {
    if (!active || !modules || modules.length === 0) return;

    // cari index modul saat ini
    const idx = modules.findIndex((m) => m.id === active.id);
    if (idx === -1 || idx === modules.length - 1) {
      // sudah modul terakhir
      return;
    }

    setCheckingNext(true);
    try {
      const passed = await checkQuizPassed(active.id);
      if (!passed) {
        alert(
          "Untuk lanjut ke modul berikutnya, kamu harus lulus kuis modul ini (minimal 4 jawaban benar)."
        );
        return;
      }

      const nextId = modules[idx + 1].id;
      setCurrentId(nextId);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("m", nextId);
        router.push(url.pathname + "?" + url.searchParams.toString());
      }
    } catch (e) {
      alert(e.message || "Gagal mengecek status kuis");
    } finally {
      setCheckingNext(false);
    }
  };

  if (!active) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <p>Modul tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex gap-6">
      {/* Sidebar Modul */}
      <aside className="w-1/3 lg:w-1/4">
        <ModuleSidebar
          modules={modules}
          activeId={active.id}
          progress={progress}
          onSelect={handleModuleSelect}
        />
      </aside>

      {/* Konten utama */}
      <section className="flex-1">
        <SignedMuxPlayer
          playbackId={active.mux_playback_id}
          onCompleted={handleVideoCompleted}
        />

        <h1 className="text-xl font-bold mt-4">{active?.title}</h1>

        <div className="mt-4">
          <ProgressBar value={overall} />
        </div>

        <div className="mt-4 flex gap-2">
          <a
            href={`/quiz/${courseId}/${active?.id}`}
            className="px-4 py-2 rounded-xl border"
          >
            Kuis Modul
          </a>
          <button
            className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-60"
            onClick={nextModule}
            disabled={checkingNext}
          >
            {checkingNext ? "Memeriksa..." : "Modul Berikutnya"}
          </button>
        </div>
      </section>
    </div>
  );
}
