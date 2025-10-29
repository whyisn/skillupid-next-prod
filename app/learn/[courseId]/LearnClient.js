"use client";

import { useEffect, useMemo, useState } from "react";
import ModuleSidebar from "@/components/ModuleSidebar";
import SignedMuxPlayer from "@/components/SignedMuxPlayer";
import ProgressBar from "@/components/ProgressBar";

export default function LearnClient({ enrollmentId, courseId, modules, activeModuleId }) {
  const [currentId, setCurrentId] = useState(activeModuleId);
  const [progress, setProgress] = useState({});

  const active = useMemo(() => modules.find(m => m.id === currentId) || modules[0], [modules, currentId]);
  useEffect(() => { setCurrentId(activeModuleId); }, [activeModuleId]);

  const handleCompleted = async () => {
    setProgress(p => ({ ...p, [active.id]: 100 }));
    await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enrollment_id: enrollmentId, module_id: active.id, percent: 100 }),
    });
  };

  const nextModule = () => {
    const idx = modules.findIndex(m => m.id === active.id);
    const next = modules[idx + 1];
    if (next) setCurrentId(next.id);
  };

  const overall = Math.round(
    (modules.length === 0 ? 0 : (modules.reduce((acc, m) => acc + (progress[m.id] || 0), 0) / (modules.length * 100)) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-12 gap-8">
      {/* Sidebar */}
      <aside className="col-span-12 md:col-span-4 lg:col-span-3 bg-white rounded-2xl shadow-md border border-borderLight">
        <ModuleSidebar
          modules={modules}
          activeId={active?.id}
          progress={progress}
          onSelect={(id) => setCurrentId(id)}
        />
      </aside>

      {/* Konten utama */}
      <section className="col-span-12 md:col-span-8 lg:col-span-9">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-borderLight">
          {active?.video_provider === "mux" && active?.video_id ? (
            <SignedMuxPlayer playbackId={active.video_id} onCompleted={handleCompleted} />
          ) : (
            <div className="aspect-video rounded-xl bg-gray-100 grid place-items-center text-gray-500">
              🎥 Video belum tersedia
            </div>
          )}

          <h1 className="text-2xl font-semibold text-textMain mt-6">{active?.title}</h1>

          <div className="mt-6">
            <ProgressBar value={overall} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`/quiz/${courseId}/${active?.id}`}
              className="px-5 py-2 rounded-xl border border-borderLight text-textMain hover:bg-gray-50"
            >
              🧠 Kuis Modul
            </a>
            <button
              onClick={nextModule}
              className="px-5 py-2 rounded-xl bg-primary text-white hover:bg-blue-700"
            >
              Modul Berikutnya →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
