export const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-primary">
    {children}
  </span>
);

export const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl shadow-sm border border-borderLight bg-white p-5 ${className}`}
  >
    {children}
  </div>
);
