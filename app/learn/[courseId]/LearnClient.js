// // app/learn/[courseId]/LearnClient.js
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import ModuleSidebar from "@/components/ModuleSidebar";
// import SignedMuxPlayer from "@/components/SignedMuxPlayer";
// import ProgressBar from "@/components/ProgressBar";
// // [TAMBAHAN] Import ikon Lock untuk modal
// import { Lock, X } from "lucide-react"; 

// export default function LearnClient({ enrollmentId, courseId, modules, activeModuleId, lockedModuleIds = [] }) {
//   const router = useRouter();
//   const [currentId, setCurrentId] = useState(activeModuleId);
//   const [progress, setProgress] = useState({}); 
//   const [checkingNext, setCheckingNext] = useState(false);
  
//   // [TAMBAHAN] State untuk mengontrol visibilitas Modal Terkunci
//   const [showLockModal, setShowLockModal] = useState(false);

//   // Validasi URL hack
//   useEffect(() => {
//     if (lockedModuleIds.includes(currentId)) {
//       const firstModuleId = modules[0]?.id;
//       if (firstModuleId) {
//         setCurrentId(firstModuleId);
//         router.replace(`/learn/${courseId}?m=${firstModuleId}`);
//       }
//     }
//   }, [currentId, lockedModuleIds, courseId, modules, router]);

//   const active = useMemo(
//     () => modules.find((m) => m.id === currentId) || modules[0],
//     [modules, currentId]
//   );

//   useEffect(() => {
//     if (!lockedModuleIds.includes(activeModuleId)) {
//       setCurrentId(activeModuleId);
//     }
//   }, [activeModuleId, lockedModuleIds]);

//   const handleCompleted = async () => {
//     if (!active) return;
//     setProgress((p) => ({ ...p, [active.id]: 100 }));
    
//     fetch("/api/progress", {
//       method: "POST",
//       headers: { "content-type": "application/json" },
//       body: JSON.stringify({
//         enrollment_id: enrollmentId,
//         module_id: active.id,
//         percent: 100,
//       }),
//     });
//   };

//   const checkQuizPassed = async (quizId) => {
//     const res = await fetch(`/api/quiz/status?quiz_id=${encodeURIComponent(quizId)}`);
//     const data = await res.json();
//     if (!res.ok) throw new Error(data?.error || "Gagal status kuis");
//     return data?.passed === true;
//   };

//   const nextModule = async () => {
//     if (!active) return;
//     const idx = modules.findIndex((m) => m.id === active.id);
//     const next = modules[idx + 1];

//       setCheckingNext(true);
//   try {
//     const passed = await checkQuizPassed(active.id);

//     if (!passed) {
//       setShowLockModal(true);
//       return;
//     }

//     // === JIKA TIDAK ADA MODUL BERIKUTNYA → KURSUS SELESAI ===
//     if (!next) {
//       const res = await fetch("/api/certificates/issue", {
//         method: "POST",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({
//           user_id: userId,
//           course_id: courseId,
//           user_name: userName,
//           course_title: courseTitle,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data?.error || "Gagal menerbitkan sertifikat");
//       }

//       // Redirect ke halaman sertifikat
//       router.push(`/cert/${data.certificate.code}`);
//       return;
//     }

//     // === MASIH ADA MODUL BERIKUTNYA → LANJUT SEPERTI BIASA ===
//     setCurrentId(next.id);
//     const url = new URL(window.location.href);
//     url.searchParams.set("m", next.id);
//     window.history.pushState({}, "", url);
//     router.refresh();
//   } catch (e) {
//     alert(e.message);
//   } finally {
//     setCheckingNext(false);
//   }

//     // if (!next) return; 

//     // setCheckingNext(true);
//     // try {
//     //   const passed = await checkQuizPassed(active.id);

//     //   if (!passed) {
//     //     // [PERUBAHAN] Ganti alert() dengan setShowLockModal(true)
//     //     setShowLockModal(true);
//     //     return;
//     //   }

//     //   setCurrentId(next.id);
//     //   const url = new URL(window.location.href);
//     //   url.searchParams.set("m", next.id);
//     //   window.history.pushState({}, "", url);
//     //   router.refresh(); 

//     // } catch (e) {
//     //   alert(e.message);
//     // } finally {
//     //   setCheckingNext(false);
//     // }
//   };

//   const overall = Math.round(
//     modules.length === 0
//       ? 0
//       : (modules.reduce((acc, m) => acc + (progress[m.id] || 0), 0) / (modules.length * 100)) * 100
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-6 relative">
//       {/* --- [MODAL START] --- */}
//       {showLockModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative scale-100 animate-in zoom-in-95 duration-200">
            
//             {/* Tombol Close (X) */}
//             <button 
//               onClick={() => setShowLockModal(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             {/* Ikon & Judul */}
//             <div className="flex flex-col items-center text-center">
//               <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
//                 <Lock className="w-7 h-7 text-red-500" />
//               </div>
              
//               <h3 className="text-xl font-bold text-gray-900 mb-2">
//                 Maaf, modul terkunci
//               </h3>
              
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 Untuk masuk ke modul berikutnya, Anda harus lulus 
//                 <span className="font-semibold text-gray-800"> Quiz pada modul ini </span> 
//                 terlebih dahulu.
//               </p>
              
//               <div className="mt-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
//                  <span className="text-xs font-medium text-gray-700">Syarat: Minimal 4 jawaban benar</span>
//               </div>

//               {/* Tombol Aksi */}
//               <div className="mt-6 w-full grid grid-cols-2 gap-3">
//                  <button
//                   onClick={() => setShowLockModal(false)}
//                   className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
//                 >
//                   Tutup
//                 </button>
//                 <a
//                   href={`/quiz/${courseId}/${active?.id}`}
//                   className="px-4 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition-colors flex items-center justify-center"
//                 >
//                   Mulai Quiz
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* --- [MODAL END] --- */}

//       <aside className="col-span-12 md:col-span-4 lg:col-span-3">
//         <ModuleSidebar
//           modules={modules}
//           activeId={active?.id}
//           progress={progress}
//           lockedModuleIds={lockedModuleIds} 
//           onSelect={(id) => {
//              if (!lockedModuleIds.includes(id)) setCurrentId(id);
//           }}
//         />
//       </aside>

//       <section className="col-span-12 md:col-span-8 lg:col-span-9">
//         {active?.video_provider === "mux" && active?.video_id ? (
//           <SignedMuxPlayer
//             playbackId={active.video_id}
//             onCompleted={handleCompleted}
//           />
//         ) : (
//           <div className="aspect-video rounded-xl bg-gray-100 grid place-items-center text-gray-500">
//             Video belum tersedia
//           </div>
//         )}

//         <h1 className="text-2xl font-bold mt-6 text-gray-900">{active?.title}</h1>
        
//         <div className="mt-4">
//            <div className="flex justify-between text-sm mb-1 text-gray-600">
//               <span>Progress Kelas</span>
//               <span>{overall}%</span>
//            </div>
//           <ProgressBar value={overall} />
//         </div>

//         <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
//           <a
//             href={`/quiz/${courseId}/${active?.id}`}
//             className="px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
//           >
//             Mulai Kuis
//           </a>
          
//           <button
//             className="px-6 py-3 rounded-xl bg-[#1ABC9C] text-white font-semibold hover:bg-[#16a085] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//             onClick={nextModule}
//             disabled={checkingNext}
//           >
//             {checkingNext ? "Memproses..." : "Modul Berikutnya"}
//             {!checkingNext && (
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
//             )}
//           </button>
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
import { Lock, X } from "lucide-react";

export default function LearnClient({
  enrollmentId,
  courseId,
  modules,
  activeModuleId,
  lockedModuleIds = [],
  // props tambahan untuk sertifikat
  userId,
  userName,
  courseTitle,
}) {
  const router = useRouter();
  const [currentId, setCurrentId] = useState(activeModuleId);
  const [progress, setProgress] = useState({});
  const [checkingNext, setCheckingNext] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  // Validasi kalau user paksa akses modul terkunci via URL
  useEffect(() => {
    if (lockedModuleIds.includes(currentId)) {
      const firstModuleId = modules[0]?.id;
      if (firstModuleId) {
        setCurrentId(firstModuleId);
        router.replace(`/learn/${courseId}?m=${firstModuleId}`);
      }
    }
  }, [currentId, lockedModuleIds, courseId, modules, router]);

  const active = useMemo(
    () => modules.find((m) => m.id === currentId) || modules[0],
    [modules, currentId]
  );

  useEffect(() => {
    if (!lockedModuleIds.includes(activeModuleId)) {
      setCurrentId(activeModuleId);
    }
  }, [activeModuleId, lockedModuleIds]);

  const handleCompleted = async () => {
    if (!active) return;
    setProgress((p) => ({ ...p, [active.id]: 100 }));

    fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        enrollment_id: enrollmentId,
        module_id: active.id,
        percent: 100,
      }),
    });
  };

  const checkQuizPassed = async (quizId) => {
    const res = await fetch(`/api/quiz/status?quiz_id=${encodeURIComponent(quizId)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Gagal status kuis");
    return data?.passed === true;
  };

  const nextModule = async () => {
    if (!active) return;

    const idx = modules.findIndex((m) => m.id === active.id);
    const next = modules[idx + 1];

    setCheckingNext(true);
    try {
      const passed = await checkQuizPassed(active.id);

      if (!passed) {
        setShowLockModal(true);
        return;
      }

      // === JIKA TIDAK ADA MODUL BERIKUTNYA → KURSUS SELESAI & TERBIT SERTIFIKAT ===
      if (!next) {
        const res = await fetch("/api/certificates/issue", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            course_id: courseId,
            user_name: userName,
            course_title: courseTitle,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Gagal menerbitkan sertifikat");
        }

        // Redirect ke halaman sertifikat
        router.push(`/cert/${data.certificate.code}`);
        return;
      }

      // === MASIH ADA MODUL BERIKUTNYA → LANJUT KE MODUL SELANJUTNYA ===
      setCurrentId(next.id);
      const url = new URL(window.location.href);
      url.searchParams.set("m", next.id);
      window.history.pushState({}, "", url);
      router.refresh();
    } catch (e) {
      alert(e.message);
    } finally {
      setCheckingNext(false);
    }
  };

  const overall = Math.round(
    modules.length === 0
      ? 0
      : (modules.reduce((acc, m) => acc + (progress[m.id] || 0), 0) /
          (modules.length * 100)) *
          100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-6 relative">
      {/* --- MODAL TERKUNCI --- */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative scale-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLockModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-red-500" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Maaf, modul terkunci
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                Untuk masuk ke modul berikutnya, Anda harus lulus
                <span className="font-semibold text-gray-800">
                  {" "}
                  Quiz pada modul ini{" "}
                </span>
                terlebih dahulu.
              </p>

              <div className="mt-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                <span className="text-xs font-medium text-gray-700">
                  Syarat: Minimal 4 jawaban benar
                </span>
              </div>

              <div className="mt-6 w-full grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowLockModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Tutup
                </button>
                <a
                  href={`/quiz/${courseId}/${active?.id}`}
                  className="px-4 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition-colors flex items-center justify-center"
                >
                  Mulai Quiz
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className="col-span-12 md:col-span-4 lg:col-span-3">
        <ModuleSidebar
          modules={modules}
          activeId={active?.id}
          progress={progress}
          lockedModuleIds={lockedModuleIds}
          onSelect={(id) => {
            if (!lockedModuleIds.includes(id)) setCurrentId(id);
          }}
        />
      </aside>

      <section className="col-span-12 md:col-span-8 lg:col-span-9">
        {active?.video_provider === "mux" && active?.video_id ? (
          <SignedMuxPlayer
            playbackId={active.video_id}
            onCompleted={handleCompleted}
          />
        ) : (
          <div className="aspect-video rounded-xl bg-gray-100 grid place-items-center text-gray-500">
            Video belum tersedia
          </div>
        )}

        <h1 className="text-2xl font-bold mt-6 text-gray-900">
          {active?.title}
        </h1>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1 text-gray-600">
            <span>Progress Kelas</span>
            <span>{overall}%</span>
          </div>
          <ProgressBar value={overall} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
          <a
            href={`/quiz/${courseId}/${active?.id}`}
            className="px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
          >
            Mulai Kuis
          </a>

          <button
            className="px-6 py-3 rounded-xl bg-[#1ABC9C] text-white font-semibold hover:bg-[#16a085] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={nextModule}
            disabled={checkingNext}
          >
            {checkingNext ? "Memproses..." : "Modul Berikutnya"}
            {!checkingNext && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
