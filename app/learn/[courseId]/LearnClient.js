// app/learn/[courseId]/LearnClient.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ModuleSidebar from "@/components/ModuleSidebar";
import SignedMuxPlayer from "@/components/SignedMuxPlayer";
import ProgressBar from "@/components/ProgressBar";
import { Lock, X } from "lucide-react"; 

export default function LearnClient({ 
    enrollmentId, courseId, modules, activeModuleId, lockedModuleIds = [], initialProgress = {},
    user_id, userName, courseTitle, courseFullyComplete 
}) {
    const router = useRouter();
    const [currentId, setCurrentId] = useState(activeModuleId);
    const [progress, setProgress] = useState(initialProgress); 
    const [checkingNext, setCheckingNext] = useState(false);
    const [showLockModal, setShowLockModal] = useState(false);
    const [lockReason, setLockReason] = useState({ video: false, quiz: false });
    const [isCertCheck, setIsCertCheck] = useState(false); 


    // ... (Logika Validasi URL & active/currentId tetap sama) ...
    
    const active = useMemo(
        () => modules.find((m) => m.id === currentId) || modules[0],
        [modules, currentId]
    );

    // Fungsi handleProgressUpdate, handleCompleted, checkQuizPassed tetap sama
    const handleProgressUpdate = async (timeEvent) => {
        if (!active || !timeEvent || !timeEvent.duration) return;
        
        let percent = Math.floor((timeEvent.currentTime / timeEvent.duration) * 100);
        const currentSaved = progress[active.id] || 0;
        
        if (percent > currentSaved) {
            setProgress((p) => ({ ...p, [active.id]: percent })); 
            
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
        router.refresh();
    };

    const checkQuizPassed = async (quizId) => {
        const res = await fetch(`/api/quiz/status?quiz_id=${encodeURIComponent(quizId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Gagal status quiz");
        return data?.passed === true;
    };


    const overallCourseProgress = useMemo(() => {
        if (!modules || modules.length === 0) return 0;
        const totalProgress = modules.reduce((acc, m) => acc + (progress[m.id] || 0), 0); 
        return Math.round(totalProgress / modules.length);
    }, [modules, progress]);
    
    const currentModuleProgress = progress[active?.id] || 0;


    const nextModule = async () => {
        if (!active) return;
        const idx = modules.findIndex((m) => m.id === active.id);
        const next = modules[idx + 1];

        if (!next) return; 

        const isVideoCompleted = progress[active.id] >= 80; 
        
        setCheckingNext(true);
        try {
            const quizPassed = await checkQuizPassed(active.id);

            if (!isVideoCompleted || !quizPassed) {
                
                setLockReason({ video: !isVideoCompleted, quiz: !quizPassed });
                setIsCertCheck(false); // Lock Progresi Modul
                setShowLockModal(true); 
                return;
            }

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


    const handleDownloadCertificate = async () => {
        if (checkingNext) return;

        if (!courseFullyComplete) {
            // Jika belum selesai, cek status modul terakhir untuk ditampilkan di modal
            const videoCompleted = progress[active.id] >= 80;
            const quizPassed = await checkQuizPassed(active.id);

            setLockReason({ video: !videoCompleted, quiz: !quizPassed });
            setIsCertCheck(true); // Lock Sertifikat
            setShowLockModal(true); 
            return;
        }

        setCheckingNext(true); 
        try {
            const res = await fetch("/api/certificates/issue", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ 
                    user_id, 
                    course_id: courseId, 
                    user_name: userName, 
                    course_title: courseTitle 
                }),
            });

            // const data = await res.json();
            // if (!res.ok || data.error) {
            //     throw new Error(data?.error || "Gagal membuat sertifikat.");
            // }

            // router.push(`/cert/${data.certificate.code}`);

            // Antisipasi kasus body kosong / bukan JSON supaya
            // tidak terjadi "Unexpected end of JSON input"
            let data = null;
            try {
              data = await res.json();
            } catch (_) {
              data = null;
            }

            if (!res.ok || data?.error) {
              throw new Error(data?.error || "Gagal membuat sertifikat.");
            }

            if (!data?.certificate?.code) {
              throw new Error("Respons sertifikat tidak valid.");
            }

            router.push(`/cert/${data.certificate.code}`);

        } catch (e) {
            alert(e.message || "Gagal memproses sertifikat.");
        } finally {
            setCheckingNext(false);
        }
    };


    const isLastModule = modules.length > 0 && active?.order_no === modules.length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-6 relative">
            {/* Modal Terkunci (Konten Dinamis) */}
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
                            
                            {/* Judul disesuaikan */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {isCertCheck ? 'Sertifikat Belum Tersedia' : 'Modul Terkunci'}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                {isCertCheck ? 'Anda harus menyelesaikan semua modul dan quiz pada kelas ini' : 'Untuk masuk ke modul berikutnya, Anda harus:'}
                            </p>
                            
                            {/* [PERUBAHAN LOGIKA LIST] List disesuaikan per konteks */}
                            <div className="w-full text-sm text-left space-y-2">
                                {isCertCheck ? (
                                    <>
                                        {/* Syarat Sertifikat (Course Wide) */}
                                        <div className={`flex items-start gap-2 p-3 rounded-lg ${lockReason.video ? 'bg-red-50' : 'bg-green-50'}`}>
                                            <span className={`font-semibold text-lg flex-shrink-0 ${lockReason.video ? 'text-red-600' : 'text-green-600'}`}>{lockReason.video ? '✕' : '✓'}</span>
                                            <span className="text-gray-700">Selesaikan seluruh modul pada course ini.</span>
                                        </div>
                                        <div className={`flex items-start gap-2 p-3 rounded-lg ${lockReason.quiz ? 'bg-red-50' : 'bg-green-50'}`}>
                                            <span className={`font-semibold text-lg flex-shrink-0 ${lockReason.quiz ? 'text-red-600' : 'text-green-600'}`}>{lockReason.quiz ? '✕' : '✓'}</span>
                                            <span className="text-gray-700">Lulus semua quiz pada course ini.</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Syarat Progresi (Current Module) */}
                                        <div className={`flex items-start gap-2 p-3 rounded-lg ${lockReason.video ? 'bg-red-50' : 'bg-green-50'}`}>
                                            <span className={`font-semibold text-lg flex-shrink-0 ${lockReason.video ? 'text-red-600' : 'text-green-600'}`}>{lockReason.video ? '✕' : '✓'}</span>
                                            <span className="text-gray-700">Tonton video hingga selesai (minimal 80%).</span>
                                        </div>
                                        <div className={`flex items-start gap-2 p-3 rounded-lg ${lockReason.quiz ? 'bg-red-50' : 'bg-green-50'}`}>
                                            <span className={`font-semibold text-lg flex-shrink-0 ${lockReason.quiz ? 'text-red-600' : 'text-green-600'}`}>{lockReason.quiz ? '✕' : '✓'}</span>
                                            <span className="text-gray-700">Lulus quis modul ini (minimal 4 benar).</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            {/* Tombol Aksi Modal */}
                            <div className="mt-6 w-full grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowLockModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Tutup
                                </button>
                                <a
                                    // Arahkan ke Quiz jika Quiz gagal, atau Lanjutkan Video jika hanya Video yang gagal
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
                    <div className="flex justify-between text-sm mb-1 text-gray-600">
                        <span>Progress Modul</span> 
                        <span className="font-semibold text-black">{currentModuleProgress}%</span> 
                    </div>
                    <ProgressBar value={currentModuleProgress} /> 
                    
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                        <span>Progress Kelas</span>
                        <span className="font-semibold text-gray-700">{overallCourseProgress}%</span>
                    </div>
                    
                    <p className="text-[10px] text-gray-400 mt-1">
                        *Dihitung berdasarkan rata-rata progress video modul
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
                    {/* Tombol Mulai Kuis */}
                    <a
                        href={`/quiz/${courseId}/${active?.id}`}
                        className="px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
                    >
                        Quiz
                    </a>
                    
                    {/* [KONDISIONAL TOMBOL KANAN] */}
                    {isLastModule ? (
                        <button
                            onClick={handleDownloadCertificate}
                            disabled={checkingNext}
                            className={`px-6 py-3 rounded-xl text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${courseFullyComplete ? 'bg-[#1ABC9C] hover:bg-[#16a085]' : 'bg-gray-400'}`}
                        >
                            {checkingNext ? "Memproses Sertifikat..." : "Unduh Sertifikat"}
                        </button>
                    ) : (
                        <button
                            onClick={nextModule}
                            disabled={checkingNext}
                            className="px-6 py-3 rounded-xl bg-[#1ABC9C] text-white font-semibold hover:bg-[#16a085] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {checkingNext ? "Memproses..." : "Modul Berikutnya"}
                            {!checkingNext && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                            )}
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
}