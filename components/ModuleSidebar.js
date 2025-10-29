// components/ModuleSidebar.js
export default function ModuleSidebar({ modules = [], activeId, progress = {}, onSelect }) {
  return (
    <div className="border rounded-xl p-3">
      <h3 className="font-semibold mb-3">Daftar Modul</h3>
      <ol className="space-y-2">
        {modules.map((m) => {
          const done = (progress[m.id] || 0) >= 100;
          const isActive = m.id === activeId;
          return (
            <li key={m.id}>
              <button
                className={`w-full text-left p-3 rounded-lg border ${isActive ? "border-black" : "border-gray-200"} hover:bg-gray-50`}
                onClick={() => onSelect?.(m.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{m.order_no}. {m.title}</span>
                  <span className={`text-xs ${done ? "text-green-600" : "text-gray-500"}`}>{done ? "Selesai" : "Belum"}</span>
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  );
}
