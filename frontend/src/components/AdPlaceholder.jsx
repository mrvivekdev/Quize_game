export default function AdPlaceholder({ className = '' }) {
  return (
    <div className={`w-full bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center min-h-[100px] overflow-hidden relative ${className}`}>
      <div className="relative flex flex-col items-center opacity-30">
        <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1 text-center">Sponsored Advertisement</span>
        <div className="w-6 h-6 rounded bg-gray-200"></div>
      </div>
    </div>
  );
}
