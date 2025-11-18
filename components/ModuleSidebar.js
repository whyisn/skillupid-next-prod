// components/ModuleSidebar.js
import { Lock, CheckCircle } from "lucide-react"; 

export default function ModuleSidebar({ modules = [], activeId, progress = {}, lockedModuleIds = [], onSelect }) {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Daftar Modul</h3>
      <ol className="space-y-3">
        {modules.map((m, index) => {
          const isLocked = lockedModuleIds.includes(m.id);
          const isActive = m.id === activeId;
          
          // Logika Selesai:
          // 1. Jika modul berikutnya sudah terbuka (tidak ada di locked list), berarti modul ini dianggap selesai.
          // 2. ATAU jika progress video/kuis sudah 100%.
          const nextModule = modules[index + 1];
          const nextIsUnlocked = nextModule && !lockedModuleIds.includes(nextModule.id);
          // Logic: Jika modul ini tidak terkunci, DAN (progress 100 ATAU modul depannya sudah kebuka/ini modul terakhir dan user lulus)
          const isDone = !isLocked && ((progress[m.id] >= 100) || nextIsUnlocked);

          return (
            <li key={m.id}>
              <button
                disabled={isLocked}
                onClick={() => !isLocked && onSelect?.(m.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center justify-between group min-h-[60px]
                  ${isActive 
                    ? "border-[#1ABC9C] bg-[#1abc9c1a] ring-1 ring-[#1ABC9C]" 
                    : isLocked 
                      ? "border-gray-100 bg-gray-50 opacity-70 cursor-not-allowed" 
                      : "border-gray-200 hover:border-[#1ABC9C] hover:shadow-sm bg-white"
                  }
                `}
              >
                {/* KIRI: Nomor dan Judul */}
                <div className="flex items-center gap-3 flex-1 mr-2">
                  {/* Nomor Urut */}
                  <span className={`
                    flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold
                    ${isActive ? "bg-[#1ABC9C] text-white" : isLocked ? "bg-gray-200 text-gray-500" : "bg-gray-100 text-gray-700"}
                  `}>
                    {m.order_no}
                  </span>
                  
                  {/* Judul - [PERBAIKAN DI SINI: Hapus truncate, izinkan wrap] */}
                  <span className={`text-sm font-medium leading-snug whitespace-normal ${isLocked ? "text-gray-400" : "text-gray-800"}`}>
                    {m.title}
                  </span>
                </div>

                {/* KANAN: Status Indikator */}
                <div className="flex-shrink-0 ml-1">
                  {isLocked ? (
                    // Kondisi 1: Terkunci -> Ikon Gembok
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : isDone ? (
                    // Kondisi 2: Selesai -> CheckCircle Hijau
                    <CheckCircle className="w-5 h-5 text-green-500 fill-green-50" />
                  ) : (
                    // Kondisi 3: Terbuka tapi Belum Selesai -> Teks "Belum"
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                      Belum
                    </span>
                  )}
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  );
}