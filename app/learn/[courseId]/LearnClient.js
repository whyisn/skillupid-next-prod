// app/learn/[courseId]/LearnClient.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ModuleSidebar from "@/components/ModuleSidebar";
import SignedMuxPlayer from "@/components/SignedMuxPlayer";
import ProgressBar from "@/components/ProgressBar";
import { Lock, X } from "lucide-react"; 

export default function LearnClient({ enrollmentId, courseId, modules, activeModuleId, lockedModuleIds = [], initialProgress = {} }) {
    const router = useRouter();
    const [currentId, setCurrentId] = useState(activeModuleId);
    // [FIX PERSISTENSI] Inisialisasi state dengan data dari Server
    const [progress, setProgress] = useState(initialProgress); 
    const [checkingNext, setCheckingNext] = useState(false);
    const [showLockModal, setShowLockModal] = useState(false);
    const [lockReason, setLockReason] = useState({ video: false, quiz: false });

    // ... (Logika Validasi URL & active/currentId tetap sama) ...
    
    const active = useMemo(
        () => modules.find((m) => m.id === currentId) || modules[0],
        [modules, currentId]
    );

    useEffect(() => {
        if (!lockedModuleIds.includes(activeModuleId)) {
            setCurrentId(activeModuleId);
        }
    }, [activeModuleId, lockedModuleIds]);

    // [BARU] Fungsi untuk mengirim/menyimpan progress secara kontinu
    const handleProgressUpdate = async (timeEvent) => {
        if (!active || !timeEvent || !timeEvent.duration) return;
        
        // Hitung persentase AKURAT dari event player
        let percent = Math.floor((timeEvent.currentTime / timeEvent.duration) * 100);
        
        const currentSaved = progress[active.id] || 0;
        
        // Optimasi: Hanya update jika progress baru LEBIH BESAR
        // dan hanya simpan setiap 5% atau lebih (atau jika melampaui 80% untuk sinkronisasi)
        if (percent > currentSaved) {
            
            // Update state lokal
            setProgress((p) => ({ ...p, [active.id]: percent })); 
            
            // Persist ke API (dengan logika optimasi pengiriman)
            if (percent % 5 === 0 || percent >= 80) {
              fetch("/api/progress", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({
                      enrollment_id: enrollmentId,
                      module_id: active.id,
                      percent: percent,
                  }),
              });
            }
        }
    };


    const handleCompleted = async () => {
        if (!active) return;
        // Logika ini tetap 100% untuk sinyal final (event 'onEnded' dari player)
        setProgress((p) => ({ ...p, [active.id]: 100 }));
        
        fetch("/api/progress", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                enrollment_id: enrollmentId,
                module_id: active.id,
                percent: 100, // Kirim status 100% final
            }),
        });
        // Refresh router agar status lock (gembok) terupdate di sidebar
        router.refresh();
    };

    const checkQuizPassed = async (quizId) => {
        const res = await fetch(`/api/quiz/status?quiz_id=${encodeURIComponent(quizId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Gagal status kuis");
        return data?.passed === true;
    };

    // [BARU] Nilai Progress Modul Aktif
    const currentModuleProgress = progress[active?.id] || 0;

    // Rumus Progress Bar (Average Course)
    const overallCourseProgress = useMemo(() => {
        if (!modules || modules.length === 0) return 0;
        const totalProgress = modules.reduce((acc, m) => acc + (progress[m.id] || 0), 0); 
        return Math.round(totalProgress / modules.length);
    }, [modules, progress]);


    const nextModule = async () => {
        if (!active) return;
        const idx = modules.findIndex((m) => m.id === active.id);
        const next = modules[idx + 1];

        if (!next) return; 

        // 1. Cek Video Completion (Syarat 80% untuk membuka modul)
        const isVideoCompleted = progress[active.id] >= 80; 
        
        setCheckingNext(true);
        try {
            const quizPassed = await checkQuizPassed(active.id);

            if (!isVideoCompleted || !quizPassed) {
                
                setLockReason({
                    video: !isVideoCompleted, // true jika belum 80%
                    quiz: !quizPassed        // true jika belum lulus
                });
                
                setShowLockModal(true); 
                return;
            }

            // Jika Lulus KEDUA syarat → Lanjut
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


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-6 relative">
            {/* Modal Terkunci (Konten dan Logika tetap sama) */}
            {showLockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    {/* ... (Modal JSX, menggunakan state lockReason untuk pesan dinamis) ... */}
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
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Untuk masuk ke modul berikutnya, Anda harus memenuhi :
                            </p>
                            <div className="w-full text-sm text-left space-y-2">
                                <div className={`flex items-start gap-2 p-3 rounded-lg ${lockReason.video ? 'bg-red-50' : 'bg-green-50'}`}>
                                    <span className={`font-semibold text-lg flex-shrink-0 ${lockReason.video ? 'text-red-600' : 'text-green-600'}`}>{lockReason.video ? '✕' : '✓'}</span>
                                    <span className="text-gray-700">Tonton video hingga selesai **(minimal 80%)**.</span>
                                </div>
                                <div className={`flex items-start gap-2 p-3 rounded-lg ${lockReason.quiz ? 'bg-red-50' : 'bg-green-50'}`}>
                                    <span className={`font-semibold text-lg flex-shrink-0 ${lockReason.quiz ? 'text-red-600' : 'text-green-600'}`}>{lockReason.quiz ? '✕' : '✓'}</span>
                                    <span className="text-gray-700">Lulus kuis modul ini **(minimal 4 benar)**.</span>
                                </div>
                            </div>
                            <div className="mt-6 w-full grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowLockModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Tutup
                                </button>
                                <a
                                    href={lockReason.quiz ? `/quiz/${courseId}/${active?.id}` : '#'} 
                                    onClick={() => !lockReason.quiz && setShowLockModal(false)} 
                                    className={`px-4 py-2.5 rounded-xl text-white font-medium transition-colors flex items-center justify-center ${lockReason.quiz ? 'bg-black hover:bg-gray-900' : 'bg-[#1ABC9C] hover:bg-[#16a085]'}`}
                                >
                                    {lockReason.quiz ? 'Mulai Quiz' : 'Lanjutkan Video'}
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
                    // [PERUBAHAN KRITIS] onTimeUpdate dipasang untuk tracking kontinu
                    <SignedMuxPlayer
                        playbackId={active.video_id}
                        onCompleted={handleCompleted}
                        onTimeUpdate={handleProgressUpdate} 
                    />
                ) : (
                    <div className="aspect-video rounded-xl bg-gray-100 grid place-items-center text-gray-500">
                        Video belum tersedia
                    </div>
                )}

                <h1 className="text-2xl font-bold mt-6 text-gray-900">{active?.title}</h1>
                
                <div className="mt-4">
                    {/* [DISPLAY BAR UTAMA MODUL] */}
                    <div className="flex justify-between text-sm mb-1 text-gray-600">
                        <span>Progress Modul Saat Ini</span> 
                        <span className="font-semibold text-black">{currentModuleProgress}%</span> 
                    </div>
                    <ProgressBar value={currentModuleProgress} /> 
                                   
                    <p className="text-[10px] text-gray-400 mt-1">
                        *Dihitung berdasarkan durasi menonton video modul
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
                    {/* ... (Tombol Kuis dan Modul Berikutnya) ... */}
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
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        )}
                    </button>
                </div>
            </section>
        </div>
    );
}