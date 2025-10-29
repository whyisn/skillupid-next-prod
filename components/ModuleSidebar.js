export default function ModuleSidebar({ modules = [], activeId, progress = {}, onSelect }) {
  return (
    <div className="rounded-2xl p-5 bg-base border border-borderLight shadow-sm">
      <h3 className="font-semibold text-textMain mb-4 text-lg">Daftar Modul</h3>
      <ol className="space-y-3">
        {modules.map((m) => {
          const done = (progress[m.id] || 0) >= 100;
          const isActive = m.id === activeId;
          return (
            <li key={m.id}>
              <button
                onClick={() => onSelect?.(m.id)}
                className={`w-full text-left p-4 rounded-xl border transition ${
                  isActive
                    ? "border-primary bg-blue-50"
                    : "border-borderLight hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm md:text-base">
                    {m.order_no}. {m.title}
                  </span>
                  <span
                    className={`text-xs ${
                      done ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {done ? "Selesai" : "Belum"}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
