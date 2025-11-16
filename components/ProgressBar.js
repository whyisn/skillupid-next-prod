// components/ProgressBar.js
export default function ProgressBar({ value = 0 }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full bg-gray-200 h-2 rounded-full">
      {/* Mengganti bg-black dengan warna tema */}
      <div 
        className="h-2 bg-[#1ABC9C] rounded-full transition-all duration-300" 
        style={{ width: `${pct}%` }} 
      />
    </div>
  );
}