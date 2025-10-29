export default function ProgressBar({ value = 0 }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
      <div
        className="h-2 bg-primary rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
