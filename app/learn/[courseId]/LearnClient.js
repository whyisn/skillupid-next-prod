// app/learn/[courseId]/LearnClient.js
"use client";

import { useEffect, useMemo, useState } from "react";
import ModuleSidebar from "@/components/ModuleSidebar";
import SignedMuxPlayer from "@/components/SignedMuxPlayer";
import ProgressBar from "@/components/ProgressBar";

export default function LearnClient({ enrollmentId, courseId, modules, activeModuleId }) {
  const [currentId, setCurrentId] = useState(activeModuleId);
  const [progress, setProgress] = useState({}); // { moduleId: percent }

  const active = useMemo(() => modules.find(m => m.id === currentId) || modules[0], [modules, currentId]);

  useEffect(() => { setCurrentId(activeModuleId); }, [activeModuleId]);

  // Simulasi: tandai progress selesai saat video diputar 5 detik (ganti dengan callback player ended)
  const handleCompleted = async () => {
    setProgress(p => ({ ...p, [active.id]: 100 }));
    // upsert progress ke API kamu
    fetch("/api/progress", {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-6">
      <aside className="col-span-12 md:col-span-4 lg:col-span-3">
        <ModuleSidebar
          modules={modules}
          activeId={active?.id}
          progress={progress}
          onSelect={(id) => setCurrentId(id)}
        />
      </aside>

      <section className="col-span-12 md:col-span-8 lg:col-span-9">
        {active?.video_provider === "mux" && active?.video_id ? (
          <SignedMuxPlayer playbackId={active.video_id} onCompleted={handleCompleted} />
        ) : (
          <div className="aspect-video rounded-xl bg-gray-100 grid place-items-center text-gray-500">
            Video belum tersedia
          </div>
        )}

        <h1 className="text-xl font-bold mt-4">{active?.title}</h1>
        <div className="mt-4">
          <ProgressBar value={overall} />
        </div>

        <div className="mt-4 flex gap-2">
          <a href={`/quiz/${courseId}/${active?.id}`} className="px-4 py-2 rounded-xl border">Kuis Modul</a>
          <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={nextModule}>Modul Berikutnya</button>
        </div>
      </section>
    </div>
  );
}
